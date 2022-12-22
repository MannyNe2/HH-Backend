const endpoints = require('./endpoints');

const initAuthRoutes = (app, endpointRoot) => {
  const authRoot = `${endpointRoot}/auth`;
  app.post(`${authRoot}/signIn`, endpoints.signIn);
  app.post(`${authRoot}/signUp`, endpoints.signUp);
  app.post(`${authRoot}/refreshToken`, endpoints.refreshToken);
};

module.exports = initAuthRoutes;
