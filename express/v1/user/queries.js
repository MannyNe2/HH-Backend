const changePassword = `
mutation changePassword($id: uuid!, $password_hash: String!) {
  update_by_pk_user(pk_columns: {id: $id}, _set: {password_hash: $password_hash}) {
    id
  }
}`;

const getUserById = `query getUserById($userId: uuid!) {
  user(where: { id: { _eq: $userId } }) {
    id
    password_hash
  }
}
`;

const getLatestCreatorRequestByUserId = `
query getLastCreatorRequestByUserId($userId: uuid!) {
  creator_request(where: {requested_by_user_id: {_eq: $userId}}, order_by: {created_at: desc}) {
    id
    updated_at
  }
}
`;

const addCreatorRequest = `
mutation addCreatorRequest($requestor: uuid!, $identification: String!) {
  insert_creator_request_one(object: {requested_by_user_id: $requestor, identification_image: $identification}) {
    id
    status
    created_at
  }
}
`;

const userQueries = {
  changePassword,
  getUserById,
  getLatestCreatorRequestByUserId,
  addCreatorRequest,
};

module.exports = userQueries;
