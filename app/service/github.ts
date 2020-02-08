import { Service } from 'egg';
import { Octokit } from '@octokit/rest';
import * as moment from 'moment';
import { EOL } from 'os';

export default class GithubService extends Service {

  public async updateRepo(path: string, str: string) {
    const { ctx, logger } = this;
    const config = ctx.app.config.github;

    if (!config.enable) return;

    const octokit = new Octokit({
      auth: config.token,
    });
    const options = {
      owner: config.owner,
      repo: config.repo,
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
    try {
      await octokit.repos.createOrUpdateFile({
        ...options,
        path,
        message: `[${config.message}] ${time}`,
        content: newContent,
        sha,
      });
    } catch (e) {
      logger.error(e);
    }
  }
}
