import { TableConfig, getCellByName, getAllCellsByType, getCellByType } from './table';
import pinyin = require('pinyin');
import oxbridgeHospitalTable from './table_oxbridge';

const hospitalTable: TableConfig = {
  guid: 'k399pHyt6HKvW6xR',
  indexKey: 'hospital',
  sheets: [ '武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施土家族苗族自治州', '仙桃市', '潜江市', '天门市' ],
  skipRows: 5,
  skipColumns: 1,
  nameRow: 3,
  typeRow: 4,
  defaultValueRow: 5,
  maxColumn: 'AE',
  preTable: oxbridgeHospitalTable,
  preTableDetect: row => getCellByName(row, '医院名称'),
  getFilePath: (sheet: string) => `hospital/hubei/${pinyin(sheet, { style: pinyin.STYLE_NORMAL }).join('')}.json`,
  feParser: async (data: any[], sheet: string) => {
    return data.map((row, id) => {
      try {
        return {
          id,
          province: '湖北',
          city: sheet,
          district: getCellByName(row, '区县').value,
          name: getCellByName(row, '医院名称').value,
          supplies: getAllCellsByType(row, 'supply').filter((cell: any) => cell.value !== 0).map((cell: any) => {
            return {
              key: cell.key,
              value: cell.value,
              specification: cell.specification,
            };
          }),
          address: getCellByType(row, 'address').value,
          url: getCellByType(row, 'url').value,
          remark: getCellByName(row, '备注').value,
          contacts: getCellByType(row, 'contact').value,
        };
      } catch {
        return null;
      }
    }).filter(item => item !== null);
  },
};

export default hospitalTable;
