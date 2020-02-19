import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller } = app;

  router.get('/patient_detail/get_nearby_information', controller.patient.getNearbyInformation);
  router.get('/patient_detail/all', controller.patient.all);

};
