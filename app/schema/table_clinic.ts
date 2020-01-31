import { TableConfig } from './table';

const clinicTable: TableConfig = {
  name: '义诊',
  guid: 'JgXjYCJJTRQxJ3GP',
  sheets: [ '工作表1' ],
  skipRows: 2,
  columns: [{
    name: '义诊单位或个人',
  }, {
    name: '联系方式',
  }, {
    name: '官方链接',
  }, {
    name: '备注',
  }, {
    name: '审核状态',
  }],
};

export default clinicTable;
