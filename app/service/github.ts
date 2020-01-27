import { Service } from 'egg';
import * as Octokit from '@octokit/rest';
import * as moment from 'moment';
import { Table } from '../schema/table';
import { ShimoSheetFetcher } from 'shimo-sheet2json';

export default class GithubService extends Service {

  public async update() {
    const { config, logger } = this.ctx.app;
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
            await this.updateRepo(`data/json/${table.name}/${sheet}.json`, JSON.stringify(data));
          }
        } catch (e) {
          logger.error(e);
        }
      }
    }
  }

  private async updateRepo(path: string, str: string) {
    const { ctx, logger } = this;
    const github = ctx.app.config.github;
    const octokit = new Octokit({
      auth: github.token,
    });
    const options = {
      owner: github.owner,
      repo: github.repo,
    };
    const time = moment().format();
    let sha = '';

    try {
      const res = await octokit.repos.getContents({
        ...options,
        path,
      });
      sha = (res.data as any).sha;
    } catch (err) {
      if (err.name !== 'HttpError') { throw err; }
    }
    logger.info(`Goona update file ${path}`);
    await octokit.repos.createOrUpdateFile({
      ...options,
      path,
      message: `[${github.message}] ${time}`,
      content: Buffer.from(str).toString('base64'),
      sha,
    });
  }
}
