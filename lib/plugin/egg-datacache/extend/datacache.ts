import { Cache } from './Cache';

function initialize() {
  console.log('initializing singleton');
  // console.log(config.toString());

  const c = new Cache();
  c.setData('test', 'hello world!');
  return c;
}

export default function(app) {
  app.addSingleton('datacache', initialize);
}
