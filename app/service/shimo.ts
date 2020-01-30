import { Service } from 'egg';
import * as request from 'request';
import { TableConfig, defaultColumnType } from '../schema/table';
import { GiteeClient } from '../component/gitee-client';

export default class ShimoService extends Service {

  private baseUrl = 'https://api.shimo.im';
  private rowBatch = 20;
  private token: string;

  private shimoDataTemp: Map<string, any>;

  public async update() {
    this.shimoDataTemp = new Map<string, any>();
    await this.updateGithub();
    await this.updateGitee();
  }

  public async updateGithub() {
    const { logger } = this;
    const { config } = this.ctx.app;
    const tables: TableConfig[] = config.github.tables;

    for (const table of tables) {
      for (const sheet of table.sheets) {
        try {
          logger.info(`Gonna get data from shimo, table=${table.name}, sheet=${sheet}`);
          let data = await this.getFileData(table, sheet);
          data = await this.ctx.service.dataFormat.format(data, table);
          this.shimoDataTemp.set(`${table.name}/${sheet}`, data);
          if (data.length > 0) {
            // only update if have data
            await this.ctx.service.github.updateRepo(`data/json/${table.name}/${sheet}.json`, JSON.stringify(data));
          }
        } catch (e) {
          logger.error(e);
        }
      }
    }
  }

  public async updateGitee() {
    const { logger } = this;
    const { config } = this.ctx.app;
    const tables: TableConfig[] = config.gitee.tables;
    const token = await GiteeClient.getToken(config.gitee.baseUrl, config.gitee.auth);
    if (!token) {
      logger.error('Get gitee token error!');
      return;
    }

    for (const table of tables) {
      for (const sheet of table.sheets) {
        try {
          logger.info(`Gonna get data from shimo for gitee, table=${table.name}, sheet=${sheet}`);
          let data = this.shimoDataTemp.get(`${table.name}/${sheet}`);
          if (data === undefined) {
            data = await this.getFileData(table, sheet);
            data = await this.ctx.service.dataFormat.format(data, table);
            this.shimoDataTemp.set(`${table.name}/${sheet}`, data);
          }
          if (data.length > 0) {
            // only update if have data
            await this.ctx.service.gitee.updateRepo(`data/json/${table.name}/${sheet}.json`, JSON.stringify(data), token);
          }
        } catch (e) {
          logger.error(e);
        }
        break;
      }
      break;
    }
  }

  private async getFileData(tableConfig: TableConfig, sheetName: string): Promise<any> {
    if (!this.token) {
      this.token = await this.getToken();
    }
    const fileContent = await this.getFileContent(this.token, tableConfig, sheetName);
    return fileContent;
  }

  private async getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const config = this.ctx.app.config.shimo;
      const options = {
        method: 'POST',
        url: `${this.baseUrl}/oauth/token`,
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

  private async getFileContent(accessToken: string, tableConfig: TableConfig, sheetName: string): Promise<any> {
    let row = tableConfig.skipHead + 1;
    let range = '';
    const maxCol = this.getMaxColumn(tableConfig.columns.length);
    let done = false;
    const res: any[] = [];
    while (!done) {
      range = `${sheetName}!A${row}:${maxCol}${row + this.rowBatch}`;
      row += this.rowBatch;
      const values = await this.getFileContentRange(accessToken, tableConfig.guid, range);
      for (const row of values) {
        if (!row.some(v => v !== null)) {
          // blank row, all data get done
          done = true;
          break;
        }
        const rowData: any[] = [];
        row.forEach((v, i) => {
          rowData.push({
            key: tableConfig.columns[i].name,
            value: v,
            type: tableConfig.columns[i].type ?? defaultColumnType,
          });
        });
        res.push(rowData);
      }
    }
    return res;
  }

  private getMaxColumn(num: number): string {
    const numToChar = (n: number): string => {
      n = Math.floor(n % 26);
      if (n === 0) {
        return '';
      }
      return String.fromCharCode(65 + n - 1);
    };
    return numToChar(num / 26) + numToChar(num); // 1 -> A, 2 -> B support 26*26
  }

  private async getFileContentRange(accessToken: string, guid: string, range: string): Promise<any[][]> {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `${this.baseUrl}/files/${guid}/sheets/values`,
        qs: {
          range,
        },
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      };
      request(options, (err: any, _: any, body: string) => {
        if (err) {
          reject(err);
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
