
import PatientTrack from './patientTrack';
import { Application } from 'egg';

module.exports = (app: Application) => {
  app.addSingleton('patientTrack', (_: any, app: Application) => {
    return new PatientTrack(app);
  });
};
