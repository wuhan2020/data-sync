import { TableConfig } from './table';

const tavelHotelTable: TableConfig = {
  guid: 'pdHRcXyKqJdqPyGJ',
  sheets: [ '工作表1' ],
  skipRows: 5,
  skipColumns: 1,
  nameRow: 3,
  typeRow: 4,
  defaultValueRow: 5,
  maxColumn: 'J',
  getFilePath: () => '武汉在外游客旅游/data.json',
};

export default tavelHotelTable;
