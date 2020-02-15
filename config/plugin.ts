import { EggPlugin } from 'egg';
import * as path from 'path';


const plugin: EggPlugin = {
  datacache: {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-datacache'),
  },

};

export default plugin;

