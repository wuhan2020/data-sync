import { Subscription } from 'egg';

export default class UpdateApi extends Subscription {
  static get schedule() {
    return {
      interval: '2h',
      type: 'worker', // only one worker needed
      immediate: false, // update on start
    };
  }
  async subscribe() {
    const { ctx } = this;
    await ctx.service.api.update();
  }
}
