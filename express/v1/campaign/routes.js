const endpoints = require('./endpoints');

const initCampaignRoutes = (app, endpointRoot) => {
  const campaignRoot = `${endpointRoot}/campaign`;
  app.post(`${campaignRoot}/back`, endpoints.backCampaign);
  app.post(`${campaignRoot}/getSentiment`, endpoints.getSentiment);
  app.post(`${campaignRoot}/getStats`, endpoints.getStats);
  app.post(`${campaignRoot}/like`, endpoints.like);
  app.post(`${campaignRoot}/dislike`, endpoints.dislike);
  app.post(`${campaignRoot}/end`, endpoints.end);
  app.post(`${campaignRoot}/withdrawFunds`, endpoints.withdrawFunds);
  app.post(`${campaignRoot}/approveWithdrawal`, endpoints.approveWithdrawal);
  app.post(`${campaignRoot}/forceStop`, endpoints.forceStopCampaign);
};

module.exports = initCampaignRoutes;
