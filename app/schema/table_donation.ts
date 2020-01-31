import { TableConfig } from './table';

const donationTable: TableConfig = {
  guid: 'W3gxW6cwkYTDY6DD',
  sheets: [ '工作表1' ],
  skipRows: 4,
  skipColumns: 1,
  nameRow: 2,
  typeRow: 3,
  defaultValueRow: 4,
  maxColumn: 'H',
  getFilePath: () => '捐赠/data.json',
};

export default donationTable;
