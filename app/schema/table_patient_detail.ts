import { TableConfig, getCellByName } from './table';
import pinyin = require('pinyin');

const patientDetailTable: TableConfig = {
  guid: '6QQ3j8DKDqtCwyDV',
  indexKey: 'patient_detail',
  sheets: [ '1安徽', '32香港' ],
  skipRows: 3,
  skipColumns: 0,
  nameRow: 3,
  typeRow: 2,
  defaultValueRow: -1,
  maxColumn: 'AD',
  getFilePath: (sheet: string) => `patient_detail/${pinyin(sheet, { style: pinyin.STYLE_NORMAL }).join('')}.json`,
  feParser: (data: any[]) => {
    const res: any[] = [];
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
        console.log(e);
      }
    });
    return res.filter(row => row.status === '已审核');
  },
  validation: () => true,
};

export default patientDetailTable;
