const endpoints = require('./endpoints');

const initUserRoutes = (app, endpointRoot) => {
  const userRoot = `${endpointRoot}/user`;
  app.post(`${userRoot}/changePassword`, endpoints.changePasswordEndpoint);
  // app.post(`${userRoot}/deleteUser`, endpoints.generate);
  app.post(`${userRoot}/requestCreatorship`, endpoints.requestCreatorship);
};

module.exports = initUserRoutes;
