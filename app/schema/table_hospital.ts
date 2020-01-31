import { TableConfig } from './table';

const hospitalTable: TableConfig = {
  name: '医院',
  guid: 'k399pHyt6HKvW6xR',
  sheets: [ '武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市',
    '随州市', '施恩土家族苗族自治州' ],
  skipRows: 5,
  skipColumns: 1,
  nameRow: 4,
  typeRow: 5,
};

export default hospitalTable;
