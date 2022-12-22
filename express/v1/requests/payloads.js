const adminPayload = {
  'https://hasura.io/jwt/claims': {
    'x-hasura-allowed-roles': ['admin'],
    'x-hasura-default-role': 'admin',
  },
};

const getUserPayload = (userId) => {
  return {
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-default-role': 'user',
      'x-hasura-user-id': userId,
    },
  };
};

const getRolePayload = (userId, role) => {
  return {
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': [role],
      'x-hasura-default-role': role,
      'x-hasura-user-id': userId,
    },
  };
};

const defaultTokenOptions = {
  expiresIn: '24h',
};

const payloads = {
  adminPayload,
  defaultTokenOptions,
  getRolePayload,
  getUserPayload,
};

module.exports = payloads;
