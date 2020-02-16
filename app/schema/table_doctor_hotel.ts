import { TableConfig, getCellByName } from './table';
import pinyin = require('pinyin');

const docHotelTable: TableConfig = {
  guid: 'Hd9C3QytrJK3RWxG',
  indexKey: 'doctor_hotel',
  sheets: [ '武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施土家族苗族自治州' ],
  skipRows: 4,
  skipColumns: 1,
  nameRow: 2,
  typeRow: 3,
  defaultValueRow: 4,
  maxColumn: 'L',
  getFilePath: (sheet: string) => `doctor_hotel/hubei/${pinyin(sheet, { style: pinyin.STYLE_NORMAL }).join('')}.json`,
  feParser: async (data: any[], sheet: string) => {
    return data.map((row, id) => {
      try {
        return {
          id,
          province: '湖北',
          city: sheet,
          hotel_name: getCellByName(row, '酒店名称').value,
          district: getCellByName(row, '酒店辖区（县区级）').value,
          address: getCellByName(row, '酒店地址').value,
          maximum_rooms: getCellByName(row, '酒店可提供房间数').value,
          maximum_guests: getCellByName(row, '酒店可接待人数').value,
          contacts: getCellByName(row, '联系方式').value.map(t => {
            return {
              name: getCellByName(row, '联系人').value,
              tel: t.tel,
            };
          }),
          url: getCellByName(row, '信息发布源链接').value,
          remark: getCellByName(row, '备注').value,
        };
      } catch (e) {
        console.log(e);
        return null;
      }
    }).filter(item => item !== null);
  },
};

export default docHotelTable;
