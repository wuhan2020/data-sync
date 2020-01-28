import { Table } from './table';

const logisticalTable: Table = {
  name: '物流',
  guid: 'RTHXp3ghtKXY3GcC',
  prefix: 'wuhan2020',
  sheets: [ '工作表1' ],
  skipHead: 2,
  columns: [{
    name: '物流名称',
  }, {
    name: '物流区域',
  }, {
    name: '联系方式',
  }, {
    name: '发布链接',
  }, {
    name: '备注',
  }, {
    name: '审核状态',
  }],
};

export default logisticalTable;
