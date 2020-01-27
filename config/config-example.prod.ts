import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.github = {
    token: 'YOUR TOKEN',
  };

  config.shimo = {
    username: 'YOUR USERNAME',
    password: 'YOUR PASSWORD',
    clientId: 'YOUR CLIENT ID',
    clientSecret: 'YOUR CLIENT SECRET',
  };

  return {
    ...config,
  };
};
