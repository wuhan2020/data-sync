import { TableConfig } from './table';

const logisticalTable: TableConfig = {
  guid: 'RTHXp3ghtKXY3GcC',
  sheets: [ '工作表1' ],
  skipRows: 4,
  skipColumns: 1,
  nameRow: 2,
  typeRow: 3,
  defaultValueRow: 4,
  maxColumn: 'H',
  getFilePath: () => '物流/data.json',
};

export default logisticalTable;
