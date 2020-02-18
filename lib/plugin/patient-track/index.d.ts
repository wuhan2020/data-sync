import PatientTrack from "./patientTrack";

declare module 'egg' {
  interface Application {
    patientTrack: PatientTrack;
  }
}
