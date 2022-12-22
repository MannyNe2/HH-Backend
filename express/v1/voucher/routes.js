const endpoints = require('./endpoints');

const initVoucherRoutes = (app, endpointRoot) => {
  const voucherRoot = `${endpointRoot}/voucher`;
  app.post(`${voucherRoot}/claim`, endpoints.claim);
  app.post(`${voucherRoot}/generate`, endpoints.generate);
};

module.exports = initVoucherRoutes;
