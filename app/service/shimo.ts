import { Service } from 'egg';
import * as request from 'requestretry';
import { TableConfig, defaultColumnType, PreTableConfig, RowData, SheetData, TableData } from '../schema/table';

export default class ShimoService extends Service {

  private baseUrl = 'https://shimo.im';
  private tokenBaseUrl = 'https://api.shimo.im';
  private rowBatch = 100;
  private maxRetryTime = 10;
  private retryDelayTime = 2000;
  private requestTimeout = 60000;
  private token: string;

  public async update() {
    const { logger } = this;
    const { config } = this.ctx.app;
    const tables: TableConfig[] = config.shimo.tables;
    this.token = await this.getToken();
    const updateFunc = async (path: string, data: any) => {
      logger.info(`Start to update ${path}`);
      await this.ctx.service.github.updateRepo(path, data);
      await this.ctx.service.gitee.updateRepo(path, data);
      await this.ctx.service.qiniu.uploadFile(path, data);
    };
    const indexFiles = {};
    const dataCount: any[] = [];
    const errorInfo: any[] = [];
    this.app.patientTrack.clearData();
    for (const table of tables) {
      if (!indexFiles[table.indexKey]) {
        indexFiles[table.indexKey] = [];
      }
      const tableData = await this.getTableData(table);
      try {
        const d = { table: table.indexKey, count: 0, confirmCount: 0 };
        for (const sheetData of tableData.data) {
          const [ data, err ] = await this.ctx.service.dataFormat.format(sheetData.data, table, sheetData.sheetName);
          errorInfo.push(...err);
          const filePath = table.getFilePath(sheetData.sheetName);
          d.count += sheetData.data.length;
          d.confirmCount += data.length;
          if (data.length > 0) {
            // only update if have data
            await updateFunc(`data/json/${filePath}`, JSON.stringify(data));
            if (table.feParser) {
              await updateFunc(`data/fe/${filePath}`, JSON.stringify(await table.feParser(data, sheetData.sheetName, this.ctx)));
            }
          }
          indexFiles[table.indexKey].push(filePath);
        }
        dataCount.push(d);
      } catch (e) {
        logger.error(e);
      }
    }
    await updateFunc('data/error.json', JSON.stringify(errorInfo));
    await updateFunc('data/index.json', JSON.stringify(indexFiles));
    logger.info(dataCount);
  }

  private async getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const config = this.ctx.app.config.shimo;
      const options = {
        method: 'POST',
        url: `${this.tokenBaseUrl}/oauth/token`,
        headers: {
          authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
        form: {
          grant_type: 'password',
          username: config.username,
          password: config.password,
          scope: 'read',
        },
      };
      request(options, (err: any, _: any, body: string) => {
        if (err) {
          reject(err);
        }
        try {
          const data = JSON.parse(body);
          if (!data.access_token) {
            reject(new Error('Get access token error, body =' + body));
          }
          resolve(data.access_token);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  private async getTableData(table: PreTableConfig): Promise<TableData> {

    const { logger } = this.ctx;

    const tableData: TableData = {
      guid: table.guid,
      data: [],
    };
    let preTableData: TableData | null = null;

    if (table.preTable) {
      // get pre table data if exists and flatten
      preTableData = await this.getTableData(table.preTable);
    }

    logger.info(`Start to get data of table ${table.guid}.`);

    const minCol = this.getColumnName(table.skipColumns + 1);
    const maxCol = table.maxColumn;
    const firstSheet = table.sheets[0];
    const types = (await this.getSheetContentRange(this.token, table.guid,
      `${firstSheet}!${minCol}${table.typeRow}:${maxCol}${table.typeRow}`))[0];
    const names = (await this.getSheetContentRange(this.token, table.guid,
      `${firstSheet}!${minCol}${table.nameRow}:${maxCol}${table.nameRow}`))[0];
    let defaultValues: any[] = [];
    if (table.defaultValueRow > 0) {
      defaultValues = (await this.getSheetContentRange(this.token, table.guid,
        `${firstSheet}!${minCol}${table.defaultValueRow}:${maxCol}${table.defaultValueRow}`))[0];
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of names) {
        defaultValues.push('');
      }
    }

    logger.info('Get names, types, values done.');

    for (const sheet of table.sheets) {
      try {
        const sheetData = await this.getSheetContent(table, sheet, names, types, defaultValues);
        tableData.data.push(sheetData);
        logger.info(`Get table ${table.guid} sheet ${sheet} done.`);
      } catch (e) {
        logger.error(e);
      }
    }

    if (table.preTableDetect !== undefined && preTableData) {
      const preDataArray: RowData[] = [];
      preTableData.data.forEach(sheet => {
        preDataArray.push(...sheet.data);
      });
      let hitSheet = false;
      tableData.data.forEach(sheet => {
        if (hitSheet) return;
        sheet.data.forEach((row, rowIndex, sheet) => {
          // replace with pre table data
          if (table.preTableDetect !== undefined) {
            const pre = preDataArray.find(r => {
              if (table.preTableDetect) {
                const preItem = table.preTableDetect(r);
                const myItem = table.preTableDetect(row);
                if (!preItem || !myItem) return false;
                return preItem.value === myItem.value;
              }
              return false;
            });
            if (pre) {
              logger.info(`Gonna merge: ${table.preTableDetect(row).value}`);
              sheet[rowIndex] = pre;
              preDataArray.splice(preDataArray.indexOf(pre), 1);
              hitSheet = true;
            }
          }
        });
        if (hitSheet) {
          sheet.data.push(...preDataArray);
        }
      });
    }

    return tableData;
  }

  private async getSheetContent(tableConfig: PreTableConfig, sheetName: string, names: any[], types: any[], defaultValues: any[]): Promise<SheetData> {

    let range = '';
    let row = tableConfig.skipRows + 1;
    const minCol = this.getColumnName(tableConfig.skipColumns + 1);
    const maxCol = tableConfig.maxColumn;
    let done = false;

    const res: SheetData = {
      sheetName,
      data: [],
    };
    while (!done) {
      range = `${sheetName}!${minCol}${row}:${maxCol}${row + this.rowBatch}`;
      row += this.rowBatch + 1;
      const values = await this.getSheetContentRange(this.token, tableConfig.guid, range);
      for (const row of values) {
        if (!row.some(v => v !== null)) {
          // blank row, all data get done
          done = true;
          break;
        }
        const rowData: RowData = [];
        row.forEach((v, i) => {
          rowData.push({
            key: names[i],
            value: v !== null ? v : defaultValues[i],
            type: types[i] ?? defaultColumnType,
          });
        });
        res.data.push(rowData);
      }
    }
    return res;
  }

  public getColumnName(num: number): string {
    const numToChar = (n: number): string => {
      n = Math.floor(n % 26);
      if (n === 0) {
        return '';
      }
      return String.fromCharCode(n + 64);
    };
    return numToChar(num / 26) + numToChar(num); // 1 -> A, 2 -> B support 26*26
  }

  private async getSheetContentRange(accessToken: string, guid: string, range: string): Promise<any[][]> {
    this.logger.info(range);
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `${this.baseUrl}/api/sas/files/${guid}/sheets/values`,
        qs: {
          range,
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
        maxAttempts: this.maxRetryTime,
        retryDelay: this.retryDelayTime,
        timeout: this.requestTimeout,
        retryStrategy: (err, _, body) => {
          return (err && err.message === 'ESOCKETTIMEDOUT') ||
            !body ||
            !(JSON.parse(body)).values;
        },
      };
      request(options, (err: any, _: any, body: string) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const data = JSON.parse(body);
          if (!data.values) {
            reject(new Error('Get values error, body =' + body));
          }
          resolve(data.values);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

}
