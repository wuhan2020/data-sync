// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportPatient from '../../../app/controller/patient';

declare module 'egg' {
  interface IController {
    patient: ExportPatient;
  }
}
