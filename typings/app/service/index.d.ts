// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportGithub from '../../../app/service/github';
import ExportShimo from '../../../app/service/shimo';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    github: ExportGithub;
    shimo: ExportShimo;
  }
}
