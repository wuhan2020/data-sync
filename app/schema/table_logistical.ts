import { TableConfig, getCellByName, getCellByType } from './table';

const logisticalTable: TableConfig = {
  guid: 'RTHXp3ghtKXY3GcC',
  indexKey: 'logistical',
  sheets: [ '国内物流入武汉' ],
  skipRows: 4,
  skipColumns: 1,
  nameRow: 2,
  typeRow: 3,
  defaultValueRow: 4,
  maxColumn: 'J',
  getFilePath: () => 'logistical/data.json',
  feParser: async (data: any[]) => {
    return data.map((row, id) => {
      return {
        id,
        name: getCellByName(row, '物流名称').value,
        from: getCellByName(row, '出发地').value,
        dest: getCellByName(row, '目的地').value,
        contacts: getCellByType(row, 'contact').value,
        date: getCellByType(row, 'date').value,
        allowPersonal: getCellByName(row, '是否接受个人捐赠').value,
        url: getCellByType(row, 'url').value,
        remark: getCellByName(row, '备注').value,
      };
    });
  },
};

export default logisticalTable;
