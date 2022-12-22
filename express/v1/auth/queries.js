const createWallet = `
mutation createWallet {
  insert_wallet_one(object: {}) {
    id
  }
}`;

const createUser = `mutation createUser(
  $firstName: String!
  $lastName: String!
  $emailAddress: String!
  $passwordHash: String!
  $displayName: String!
  $gender: String!
  $walletId: uuid!
) {
  insert_user_one(
    object: {
      email_address: $emailAddress
      first_name: $firstName
      last_name: $lastName
      password_hash: $passwordHash
      display_name: $displayName
      gender: $gender
      wallet_id: $walletId
    }
  ) {
    id
    first_name
    last_name
    display_name
    role
    is_verified
    is_banned
    avatar
		gender
  }
}`;

const getUsersByEmail = `query getUserByEmail($emailAddress: String!) {
  user(where: { email_address: { _ilike: $emailAddress } }) {
    id
    first_name
    last_name
    is_verified
    is_banned
    avatar
    display_name
    password_hash
    role
  }
}`;

const getUserById = `query getUserById($userId: uuid!) {
    user(where: { id: { _eq: $userId } }) {
      id
      role
      updated_at
    }
  }
`;

const authQueries = {
  createWallet,
  createUser,
  getUsersByEmail,
  getUserById,
};

module.exports = authQueries;
