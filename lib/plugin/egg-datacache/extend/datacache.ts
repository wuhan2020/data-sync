import { Cache } from './Cache';

const initialize = () => {
  return new Cache();
};

export default function(app) {
  app.addSingleton('datacache', initialize);
}
