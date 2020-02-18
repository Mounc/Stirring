export { default as userController } from './user';
export { default as authController } from './auth';

export const statusController = {
  check: ctx => {
    ctx.body = 'OK';
  },
};