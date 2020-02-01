import { TableConfig, getCellByName, getCellByType } from './table';

const logisticalTable: TableConfig = {
  guid: 'RTHXp3ghtKXY3GcC',
  indexKey: 'logistical',
  sheets: [ '工作表1' ],
  skipRows: 4,
  skipColumns: 1,
  nameRow: 2,
  typeRow: 3,
  defaultValueRow: 4,
  maxColumn: 'H',
  getFilePath: () => 'logistical/data.json',
  feParser: (data: any[]) => {
    return data.map((row, id) => {
      return {
        id,
        name: getCellByName(row, '物流名称').value,
        area: getCellByName(row, '物流区域').value,
        contacts: getCellByType(row, 'contact').value,
        date: getCellByType(row, 'date').value,
        url: getCellByType(row, 'url').value,
        remark: getCellByName(row, '备注').value,
      };
    });
  },
};

export default logisticalTable;
