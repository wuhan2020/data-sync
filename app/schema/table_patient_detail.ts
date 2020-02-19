import { TableConfig, getCellByName } from './table';
import pinyin = require('pinyin');
import { Context } from 'egg';

const patientDetailTable: TableConfig = {
  guid: '6QQ3j8DKDqtCwyDV',
  indexKey: 'patient_detail',
  sheets: [ '18广西', '1安徽', '2河南', '3浙江', '4江苏', '5广东', '11山东', '13重庆', '14福建', '15天津', '16云南', '17四川', '21辽宁', '23内蒙古', '24贵州', '25甘肃', '32香港', '33澳门' ],
  skipRows: 3,
  skipColumns: 0,
  nameRow: 3,
  typeRow: 2,
  defaultValueRow: -1,
  maxColumn: 'AD',
  getFilePath: (sheet: string) => `patient_detail/${pinyin(sheet, { style: pinyin.STYLE_NORMAL }).join('')}.json`,
  feParser: async (data: any[], sheetName: string, ctx: Context) => {
    let res: any[] = [];
    let current: any = null;
    const addTravelAndEventData = (rowData: any, row: any) => {
      if ([ '时间', '出行方式', '车次/车厢/座位', '起始（上车）地', '目的（下车）地' ].some(col => getCellByName(row, col).value !== '')) {
        rowData.travelData.push({
          travelDate: getCellByName(row, '时间').value,
          travelMethod: getCellByName(row, '出行方式').value,
          travelDetail: getCellByName(row, '车次/车厢/座位').value,
          travelFrom: getCellByName(row, '起始（上车）地').value,
          travelTo: getCellByName(row, '目的（下车）地').value,
        });
      }
      if ([ '地点', '事件', '开始时间', '结束时间' ].some(col => getCellByName(row, col).value !== '')) {
        rowData.eventData.push({
          eventAddr: getCellByName(row, '地点').value,
          eventContent: getCellByName(row, '事件').value,
          eventStartTime: getCellByName(row, '开始时间').value,
          eventEndTime: getCellByName(row, '结束时间').value,
        });
      }
    };
    data.forEach(row => {
      try {
        if (getCellByName(row, '患者编号').value) {
          // new patient
          if (current) res.push(current);
          current = {
            id: getCellByName(row, '患者编号').value,
            isFromHubei: getCellByName(row, '是否湖北居民').value,
            name: getCellByName(row, '患者名').value,
            province: getCellByName(row, '省').value,
            city: getCellByName(row, '市').value,
            district: getCellByName(row, '区/县').value,
            street: getCellByName(row, '镇/街道').value,
            age: getCellByName(row, '年龄').value,
            gender: getCellByName(row, '性别').value,
            intimateContacts: getCellByName(row, '密切患者').value,
            leaveHubeiDate: getCellByName(row, '离鄂时间').value,
            leaveHubeiCity: getCellByName(row, '离鄂城市').value,
            attackDate: getCellByName(row, '发病日期').value,
            attackAddr: getCellByName(row, '发病地点').value,
            confirmDate: getCellByName(row, '确诊日期').value,
            confirmHospital: getCellByName(row, '确诊医院').value,
            symptoms: getCellByName(row, '病症').value,
            intimateContactsCount: getCellByName(row, '密触人数').value,
            travelData: [],
            eventData: [],
            urls: [
              getCellByName(row, '数据源1').value,
              getCellByName(row, '数据源2').value,
            ].filter(url => !!url),
            status: getCellByName(row, '审核状态').value,
          };
        }
        addTravelAndEventData(current, row);
      } catch (e) {
        ctx.logger.error(row);
        ctx.logger.error(e);
      }
    });
    const getCoord = async (addr: string): Promise<any> => {
      if (addr.trim() === '') return null;
      while (!Number.isNaN(parseInt(addr.charAt(0)))) {
        addr = addr.substring(1);
      }
      if (!ctx.app.datacache.hasKey(addr)) {
        const coordRes = await ctx.service.location.retrieveCoordinateViaGD(addr) as any;
        let coord: any = null;
        if (coordRes && coordRes.list && coordRes.list.length > 0) {
          coord = {
            province: coordRes.list[0].province,
            city: coordRes.list[0].city,
            district: coordRes.list[0].district,
            long: coordRes.list[0].longitude,
            lat: coordRes.list[0].latitude,
          };
        } else {
          console.log('Coord not found for ', addr, ', res=', coordRes);
        }
        ctx.app.datacache.setData(addr, coord);
      }
      return ctx.app.datacache.getDataByKey(addr);
    };
    res = res.filter(row => row.status === '已审核');
    for (const item of res) {
      const confirmHospital = sheetName + item.confirmHospital;
      item.confirmHospital = {
        addr: item.confirmHospital,
        coord: await getCoord(confirmHospital),
      };
    }
    ctx.app.patientTrack.addData(res);
    return res;
  },
  validation: () => true,
};

export default patientDetailTable;
