import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('Wuhan2020');
  }
  public heartbeat() {
    const { ctx } = this;
    ctx.body = 'Running';
  }
}
