import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/utility.test.js', () => {
  let ctx: Context;
  before(async () => {
    ctx = app.mockContext();
  });

  it('sayHi', async () => {
    const addr1 = 'http://www.sina.com';
    const addr2 = 'https://www.sina.com';
    const addr3 = 'www.sina.com';
    // const addr4 = 'abc';
    const result1 = await ctx.service.utility.checkURLConnectivity(addr1);
    ctx.logger.info('result1= ' + JSON.stringify(result1));
    const result2 = await ctx.service.utility.checkURLConnectivity(addr2);
    console.log('result2= ' + JSON.stringify(result2));
    const result3 = await ctx.service.utility.checkURLConnectivity(addr3);
    console.log('result3= ' + JSON.stringify(result3));
    // const result4 = await ctx.service.utility.checkURLConnectivity(addr4);
    // console.log('result4= ' + JSON.stringify(result4));

  });
});
