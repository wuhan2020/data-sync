import { Table } from './table';

const hotelTable: Table = {
  name: '宾馆',
  guid: 'Hd9C3QytrJK3RWxG',
  sheets: [ '武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市',
    '随州市', '施恩土家族苗族自治州' ],
  skipHead: 1,
  columns: [{
    name: '酒店名称',
  }, {
    name: '酒店辖区（县区级）',
  }, {
    name: '酒店地址',
  }, {
    name: '酒店可提供房间数',
  }, {
    name: '酒店可接待人数',
  }, {
    name: '联系人',
  }, {
    name: '联系方式',
  }, {
    name: '备注',
  }, {
    name: '信息发布源链接',
  }, {
    name: '审核状态',
  }],
};

export default hotelTable;
