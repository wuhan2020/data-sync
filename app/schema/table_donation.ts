import { TableConfig, getCellByName, getCellByType } from './table';

const donationTable: TableConfig = {
  guid: 'W3gxW6cwkYTDY6DD',
  sheets: [ '工作表1' ],
  skipRows: 4,
  skipColumns: 1,
  nameRow: 2,
  typeRow: 3,
  defaultValueRow: 4,
  maxColumn: 'H',
  getFilePath: () => 'donation/data.json',
  feParser: (data: any[]) => {
    return data.map(row => {
      return {
        name: getCellByName(row, '受赠方').value,
        method: getCellByName(row, '收款方式').value,
        info: getCellByName(row, '收款账户').value,
        date: getCellByType(row, 'date').value,
        url: getCellByType(row, 'url').value,
        status: getCellByName(row, '当前状态').value,
      };
    });
  },
};

export default donationTable;
