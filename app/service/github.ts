import { Service } from 'egg';
import * as Octokit from '@octokit/rest';
import * as moment from 'moment';

export default class GithubService extends Service {
  async test() {
    const myPath = 'test2.yaml';
    await this.updateRepo(myPath, '');
  }
  async updateRepo(path: string, str: string) {
    const { ctx, logger } = this;
    const { config } = ctx.app;
    const { github } = config;
    const octokit = new Octokit({
      auth: github.token,
    });
    const options = {
      owner: github.owner,
      repo: github.repo,
    };
    const time = moment().format();
    const content = `${time}\n${str}`;
    let sha;

    try {
      const res = await octokit.repos.getContents({
        ...options,
        path,
      });
      sha = (res.data as any).sha;
    } catch (err) {
      if (err.name === 'HttpError') { logger.error(`${path} is not exist.`); } else { throw err; }
    }
    await octokit.repos.createOrUpdateFile({
      ...options,
      path,
      message: `[${github.message}] ${time}`,
      content: Buffer.from(content).toString('base64'),
      sha,
    });
  }
}
