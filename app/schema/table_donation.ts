import { TableConfig } from './table';

const donationTable: TableConfig = {
  name: '捐款',
  guid: 'W3gxW6cwkYTDY6DD',
  sheets: [ '工作表1' ],
  skipHead: 2,
  columns: [{
    name: '受赠方',
  }, {
    name: '收款方式',
  }, {
    name: '官方链接',
  }, {
    name: '收款账户',
  }, {
    name: '当前状态',
  }, {
    name: '审核状态',
  }],
};

export default donationTable;
