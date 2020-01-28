import { Service } from 'egg';
import * as Octokit from '@octokit/rest';
import * as moment from 'moment';
import { Table } from '../schema/table';
import { ShimoSheetFetcher } from 'shimo-sheet2json';
import { EOL } from 'os';

export default class GithubService extends Service {

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
            await this.updateRepo(`data/json/${table.prefix}/${table.name}/${sheet}.json`, JSON.stringify(data));
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
    const newContent = Buffer.from(str).toString('base64');

    try {
      const res = await octokit.repos.getContents({
        ...options,
        path,
      });
      sha = (res.data as any).sha;
      const content = (res.data as any).content;
      if (content.split(EOL).join('') === newContent) {
        // returned content have multi lines, need to join
        // no need to update
        return;
      }
    } catch (err) {
      if (err.name !== 'HttpError') { throw err; }
    }
    logger.info(`Goona update file ${path}`);
    await octokit.repos.createOrUpdateFile({
      ...options,
      path,
      message: `[${github.message}] ${time}`,
      content: newContent,
      sha,
    });
  }
}
