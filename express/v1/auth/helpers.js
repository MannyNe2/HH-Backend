const authQueries = require('./queries');
const signedRequests = require('../requests/signedRequests');

const findUser = async (emailAddress) => {
  const variables = {
    emailAddress: emailAddress,
  };
  const data = (
    await signedRequests.api(authQueries.getUsersByEmail, variables)
  ).data;
  if (data.user.length > 0) {
    return data.user[0];
  } else {
    return false;
  }
};

const createWallet = async () => {
  const data = (await signedRequests.api(authQueries.createWallet, {})).data;
  if (data.insert_wallet_one) {
    return data.insert_wallet_one;
  } else {
    return false;
  }
};

const createUser = async (
  emailAddress,
  passwordHash,
  firstName,
  lastName,
  displayName,
  gender,
  walletId
) => {
  const variables = {
    emailAddress: emailAddress,
    passwordHash: passwordHash,
    firstName: firstName,
    lastName: lastName,
    displayName: displayName,
    gender: gender,
    walletId: walletId
  };
  const data = (await signedRequests.api(authQueries.createUser, variables))
    .data;
  if (data.insert_user_one) {
    return data.insert_user_one;
  } else {
    return false;
  }
};

const getUserById = async (userId) => {
  const variables = {
    userId: userId,
  };
  const data = (await signedRequests.api(authQueries.getUserById, variables))
    .data;
  if (data && data.user[0]) {
    return data.user[0];
  } else {
    return false;
  }
};

module.exports = {
  findUser,
  createUser,
  createWallet,
  getUserById
};
