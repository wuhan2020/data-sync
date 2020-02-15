import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    // const str = this.app.egg-datacache.getDatabyKey('test');
    // this.ctx.logger.info(str);
    ctx.body = 'hi';
  }
}
