import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import hospitalTable from '../app/schema/table_hospital';
import logisticalTable from '../app/schema/table_logistical';
import hotelTable from '../app/schema/table_hotel';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1580105641943_6222';

  // add your egg config in here
  config.middleware = [];

  config.cluster = {
    listen: {
      port: 7001,
      hostname: '0.0.0.0', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用 path: '/var/run/egg.sock',
    },
  };

  const githubConfig = {
    token: 'YOUR TOKEN',
    owner: 'wuhan2020',
    repo: 'wuhan2020-test',
    message: 'data-sync',
    tables: [hospitalTable, logisticalTable, hotelTable],
  };

  config.github = githubConfig;

  config.shimo = {
    username: 'YOUR USERNAME',
    password: 'YOUR PASSWORD',
    clientId: 'YOUR CLIENT ID',
    clientSecret: 'YOUR CLIENT SECRET',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
  };
};
