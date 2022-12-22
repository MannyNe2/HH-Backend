const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');
const payloads = require('./payloads');

const defaultTokenOptions = {
  expiresIn: '24h',
};

const roles = {
  admin: 'admin',
  user: 'user',
};

const generateRequestConfig = (query, variables, token) => {
  return {
    method: 'post',
    url: process.env.HASURA_GRAPHQL_V1_HOST,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: JSON.stringify({
      query: query,
      variables: variables,
    }),
  };
};

const role = async (query, variables, userId, role) => {
  const token = jwt.sign(
    payloads.getRolePayload(userId, role),
    process.env.JWT_SECRET,
    defaultTokenOptions
  );
  const requestConfig = generateRequestConfig(query, variables, token);
  const result = (await axios(requestConfig)).data;
  return result;
};

const user = async (query, variables, userId) => {
  return role(query, variables, userId, roles.user);
};

const admin = async (query, variables, userId) => {
  return role(query, variables, userId, roles.admin);
};

const api = async (query, variables) => {
  const token = jwt.sign(
    payloads.adminPayload,
    process.env.JWT_SECRET,
    defaultTokenOptions
  );

  const requestConfig = generateRequestConfig(query, variables, token);
  const result = (await axios(requestConfig)).data;
  return result;
};

const signedRequests = {
  admin,
  api,
  role,
  user,
};

module.exports = signedRequests;
