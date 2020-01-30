import { Service } from 'egg';
import { Table } from '../schema/table';
import { ShimoSheetFetcher } from 'shimo-sheet2json';

export default class ShimoService extends Service {

  public async update() {
    const { logger } = this;
    const { config } = this.ctx.app;
    const shimoFetcher = new ShimoSheetFetcher(config.shimo);
    const tables: Table[] = config.github.tables;

    for (const table of tables) {
      for (const sheet of table.sheets) {
        try {
          logger.info(`Gonna get data from shimo, table=${table.name}, sheet=${sheet}`);
          let data = await shimoFetcher.getFileData({
            guid: table.guid,
            sheetName: sheet,
            skipHead: table.skipHead,
            columns: table.columns,
          });
          data = data.filter((item: any) => item['审核状态'] !== null);
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
}
