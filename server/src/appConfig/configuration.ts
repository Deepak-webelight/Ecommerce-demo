import { Iconfiguration } from 'src/modules/user/user.interface';

const appConfig = (requestedEnv: keyof Iconfiguration) => {
  return process.env[requestedEnv];
};
export default appConfig;
