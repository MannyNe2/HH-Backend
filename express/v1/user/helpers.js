const signedRequests = require('../requests/signedRequests');
const userQueries = require('./queries');

const validatePassword = (password) => {
  if (password.length > 0) {
    return true;
  } else {
    return false;
  }
};

const changePassword = async (userId, password_hash) => {
  const variables = {
    id: userId,
    password_hash: password_hash,
  };
  const data = (await signedRequests.api(userQueries.changePassword, variables))
    .data;
  if (data.update_by_pk_user) {
    return data.update_by_pk_user.id;
  } else {
    return false;
  }
};

const getUserById = async (userId) => {
  const variables = {
    userId: userId,
  };
  const data = (await signedRequests.api(userQueries.getUserById, variables))
    .data;
  if (data && data.user[0]) {
    return data.user[0];
  } else {
    return false;
  }
};

const getPreviousCreatorRequests = async (userId) => {
  try {
    const variables = {
      userId: userId,
    };
    const data = (
      await signedRequests.api(
        userQueries.getLatestCreatorRequestByUserId,
        variables
      )
    ).data;
    if (data && data.creator_request.length) {
      return data.creator_request;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const addCreatorRequest = async (requestor, identification) => {
  try {
    const variables = {
      requestor: requestor,
      identification: identification,
    };

    const data = (
      await signedRequests.api(userQueries.addCreatorRequest, variables)
    ).data;

    if (data && data.insert_creator_request_one) {
      return data.insert_creator_request_one;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  changePassword,
  validatePassword,
  getUserById,
  getPreviousCreatorRequests,
  addCreatorRequest
};
