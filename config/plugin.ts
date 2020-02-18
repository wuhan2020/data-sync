import { EggPlugin } from 'egg';
import * as path from 'path';

const plugin: EggPlugin = {
  datacache: {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-datacache'),
  },

  patientTrack: {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/patient-track'),
  },
};

export default plugin;
