import { TableConfig } from './table';

const hospitalTable: TableConfig = {
  guid: 'q6WP3DpKKgVW63Pr',
  sheets: [ '武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '施恩土家族苗族自治州', '仙桃市', '潜江市', '天门市' ],
  skipRows: 6,
  skipColumns: 1,
  nameRow: 4,
  typeRow: 5,
  defaultValueRow: 6,
  maxColumn: 'BR',
  getFilePath: (sheet: string) => `医院/湖北/${sheet}.json`,
};

export default hospitalTable;
