import { Subscription } from 'egg';

export default class UpdateShimo extends Subscription {
  static get schedule() {
    return {
      interval: '10s', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }
  async subscribe() {
    const { ctx } = this;
    await ctx.service.github.test();
  }
}
