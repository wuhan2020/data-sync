import { Service } from 'egg';
import * as Octokit from '@octokit/rest';

export default class GithubService extends Service {
  async updateRepo() {
    const { ctx } = this;
    const { config } = ctx.app;
    const { github } = config;

    const octokit = new Octokit({
      auth: github.token,
    });

    const options = {
      owner: github.owner,
      repo: github.repo,
    };

    const myPath = 'test2.yaml';
    let sha;
    const content = Date.now().toString();
    try {
      const res = await octokit.repos.getContents({
        ...options,
        path: myPath,
      });
      sha = (res.data as any).sha;
    } catch (err) {
      if (err.name === 'RequestError') { console.log(myPath + 'is not exist.'); } else { throw err; }
    }
    await octokit.repos.createOrUpdateFile({
      ...options,
      path: myPath,
      message: github.message,
      content: Buffer.from(content).toString('base64'),
      sha,
    });
  }
}
