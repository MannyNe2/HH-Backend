const endpointRoot = '/v1';
const initAuthRoutes = require('./auth/routes');
const initUserRoutes = require('./user/routes');
const initVoucherRoutes = require('./voucher/routes');
const initCampaignRoutes = require('./campaign/routes');

const initRoutes_v1 = (app) => {
  initAuthRoutes(app, endpointRoot);
  initUserRoutes(app, endpointRoot);
  initVoucherRoutes(app, endpointRoot);
  initCampaignRoutes(app, endpointRoot);
};

module.exports = initRoutes_v1;
