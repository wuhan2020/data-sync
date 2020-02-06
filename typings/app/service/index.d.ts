// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApi from '../../../app/service/api';
import ExportDataFormat from '../../../app/service/data_format';
import ExportGitee from '../../../app/service/gitee';
import ExportGithub from '../../../app/service/github';
import ExportLocation from '../../../app/service/location';
import ExportQiniu from '../../../app/service/qiniu';
import ExportShimo from '../../../app/service/shimo';
import ExportUtility from '../../../app/service/utility';

declare module 'egg' {
  interface IService {
    api: ExportApi;
    dataFormat: ExportDataFormat;
    gitee: ExportGitee;
    github: ExportGithub;
    location: ExportLocation;
    qiniu: ExportQiniu;
    shimo: ExportShimo;
    utility: ExportUtility;
  }
}
