import { Table } from './table';

const hospitalTable: Table = {
  name: '医院',
  guid: 'k399pHyt6HKvW6xR',
  sheets: [ '武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市',
    '随州市', '施恩土家族苗族自治州' ],
  prefix: 'wuhan2020',
  skipHead: 5,
  columns: [{
    name: '区县',
  }, {
    name: '医院名称',
  }, {
    name: '普通医用口罩',
  }, {
    name: '医用外科口罩',
  }, {
    name: '医用防护口罩 | N95口罩',
  }, {
    name: '防冲击眼罩/护目镜/防护眼镜',
  }, {
    name: '防护面罩',
  }, {
    name: '防护帽/医用帽/圆帽',
  }, {
    name: '隔离衣',
  }, {
    name: '防护服',
  }, {
    name: '手术衣',
  }, {
    name: '乳胶手套',
  }, {
    name: '长筒胶鞋/防污染靴',
  }, {
    name: '防污染鞋套',
  }, {
    name: '防污染靴套',
  }, {
    name: '84消毒液',
  }, {
    name: '过氧乙酸',
  }, {
    name: '75%酒精',
  }, {
    name: '手部皮肤消毒液',
  }, {
    name: '活力碘',
  }, {
    name: '床罩',
  }, {
    name: '医用面罩式雾化器',
  }, {
    name: '测体温设备',
  }, {
    name: '空气消毒设备',
  }, {
    name: '医用紫外线消毒车',
  }, {
    name: '官方链接',
  }, {
    name: '医院地址',
  }, {
    name: '联系方式',
  }, {
    name: '备注',
  }, {
    name: '审核状态',
  }],
};

export default hospitalTable;
