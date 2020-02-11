import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/location.test.js', () => {
  let ctx: Context;
  before(async () => {
    ctx = app.mockContext();
  });

  it('sayHi', async () => {
    // const addr1 = '北京市朝阳区郎家园138号[3-3]2幢1层C座666室';
    // const addr2 = '武汉市洪山区南湖书城路99号昊天大厦87楼';
    // let addr3 = '武昌区积玉桥街和平大道716号恒大世纪广场2602室';
    // let addr4 = '洪山区高新二路光谷云计算高新企业孵化中心2号楼19楼';
    // const addr5 = '朝阳区郎家园138号[3-3]2幢1层C座666室';
    // const result1 = await ctx.service.location.retrieveCoordinateViaBD(addr1);
    // const result2 = await ctx.service.location.retrieveCoordinateViaGD(addr2);
    // const result3 = await ctx.service.location.getLocationFromCache(addr5);
    // console.log(JSON.stringify(result1));
    // console.log(JSON.stringify(result2));
    // console.log(JSON.stringify(result3));
    ctx.logger.info('nothing to test');
  });
});
