import { Service } from 'egg';

export default class GithubService extends Service {
  results = [];
  async updateRepo() {
    const { ctx } = this;
    const { config } = ctx.app;
  }
}
