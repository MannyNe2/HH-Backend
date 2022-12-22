const getCampaignById = `
query getCampaignById($campaignId: uuid!) {
  campaign_by_pk(id: $campaignId) {
    id
    is_private
    is_enabled
    is_ended
    deadline
    end_status
    creator {
      id
      is_banned
    }
  }
}`;
const getCampaignInfo = `
query getCampaignInfo($campaignId: uuid!) {
  campaign_by_pk(id: $campaignId) {
    id
    is_private
    is_enabled
    likes_aggregate {
      aggregate {
        count
      }
    }
    dislikes_aggregate {
      aggregate {
        count
      }
    }
    creator {
      id
    }
  }
}`;
const getUserAndWallet = `
query getUserAndWallet($userId: uuid!) {
  user_by_pk(id: $userId) {
    id
    is_banned
    wallet {
      id
      useable_balance
    }
  }
}`;

const getUserPledge = `
query getUserPledge($walletId: uuid!, $campaignId: uuid!) {
  pledge(where: {_and: {wallet_id: {_eq: $walletId}, campaign_id: {_eq: $campaignId}}}) {
    id
    amount
    accept_rewards
  }
}`;

const backCampaign = `
mutation backCampaign(
  $campaignId: uuid!
  $walletId: uuid!
  $startingBalance: numeric!
  $amount: numeric!
  $finalBalance: numeric!
  $acceptRewards: Boolean = true
  $transactionRemark: String!
) {
  update_by_pk_wallet(
    pk_columns: { id: $walletId }
    _inc: { useable_balance: $amount }
  ) {
    updated_at
    useable_balance
  }
  insert_pledge_one(
    object: {
      wallet_id: $walletId
      campaign_id: $campaignId
      amount: $amount
      accept_rewards: $acceptRewards
    }
  ) {
    id
    status
  }
  insert_transaction_one(
    object: {
      wallet_id: $walletId
      starting_balance: $startingBalance
      amount: $amount
      final_balance: $finalBalance
      remark: $transactionRemark
    }
  ) {
    id
  }
}`;

const addToPledge = `
mutation addToPledge(
  $pledgeId: uuid!
  $walletId: uuid!
  $startingBalance: numeric!
  $transactionAmount: numeric!
  $finalPledgedAmount: numeric!
  $finalBalance: numeric!
  $acceptRewards: Boolean!
  $transactionRemark: String!
) {
  update_by_pk_wallet(
    pk_columns: { id: $walletId }
    _inc: { useable_balance: $transactionAmount }
  ) {
    updated_at
    useable_balance
  }
  update_by_pk_pledge(
    pk_columns: { id: $pledgeId }
    _set: { amount: $finalPledgedAmount, accept_rewards: $acceptRewards }
  ) {
    id
    updated_at
  }
  insert_transaction_one(
    object: {
      wallet_id: $walletId
      starting_balance: $startingBalance
      amount: $transactionAmount
      final_balance: $finalBalance
      remark: $transactionRemark
    }
  ) {
    id
  }
}
`;

const getLikeAndDislikeByPk = `
query getLikeAndDislikeByPk($campaignId: uuid!, $userId: uuid!) {
  campaign_like_by_pk(campaign_id: $campaignId, user_id: $userId) {
    campaign_id
    user_id
  }
  campaign_dislike_by_pk(campaign_id: $campaignId, user_id: $userId) {
    campaign_id
    user_id
  }
  campaign_like_aggregate(where: {campaign_id: {_eq: $campaignId}}) {
    aggregate {
      count
    }
  }
  campaign_dislike_aggregate(where: {campaign_id: {_eq: $campaignId}}) {
    aggregate {
      count
    }
  }
}
`;

const addLike = `
mutation addLike($campaignId: uuid!, $userId: uuid!) {
  insert_campaign_like_one(object: {campaign_id: $campaignId, user_id: $userId}) {
    campaign_id
    user_id
  }
}
`;
const addDislike = `
mutation addDislike($campaignId: uuid!, $userId: uuid!) {
  insert_campaign_dislike_one(object: {campaign_id: $campaignId, user_id: $userId}) {
    campaign_id
    user_id
  }
}
`;

const removeLike = `
mutation removeLike($campaignId: uuid!, $userId: uuid!) {
  delete_by_pk_campaign_like(campaign_id: $campaignId, user_id: $userId) {
    user_id
    campaign_id
  }
}
`;
const removeDislike = `
mutation removeDislike($campaignId: uuid!, $userId: uuid!) {
  delete_by_pk_campaign_dislike(campaign_id: $campaignId, user_id: $userId) {
    user_id
    campaign_id
  }
}
`;

const likeToDislikeSwap = `
mutation likeToDislikeSwap($campaignId: uuid!, $userId: uuid!) {
  delete_by_pk_campaign_like(campaign_id: $campaignId, user_id: $userId) {
    user_id
    campaign_id
  }
  insert_campaign_dislike_one(object: {campaign_id: $campaignId, user_id: $userId}) {
    campaign_id
    user_id
  }
}
`;

const dislikeToLikeSwap = `
mutation dislikeToLikeSwap($campaignId: uuid!, $userId: uuid!) {
  delete_by_pk_campaign_dislike(campaign_id: $campaignId, user_id: $userId) {
    user_id
    campaign_id
  }
  insert_campaign_like_one(object: {campaign_id: $campaignId, user_id: $userId}) {
    campaign_id
    user_id
  }
}
`;

const getCampaignPledgeStats = `
query getCampaignPledgeStats($campaignId: uuid!) {
  campaign_by_pk(id: $campaignId) {
    pledges_sum:pledges_aggregate {
      aggregate {
        sum {
          amount
        }
      }
    }
    pledges_count:pledges_aggregate(distinct_on: wallet_id) {
      aggregate {
        count
      }
    }
  }
}
`;

const getCampaignCurrentUserStats = `
query currentUserRelation($campaignId: uuid!, $userId: uuid!) {
  campaign_like_by_pk(campaign_id: $campaignId, user_id: $userId) {
    user_id
    campaign_id
  }
  campaign_dislike_by_pk(campaign_id: $campaignId, user_id: $userId) {
    user_id
    campaign_id
  }
  saved_campaign_by_pk(campaign_id: $campaignId, user_id: $userId) {
    created_at
  }
  pledge(where: {wallet: {user: {id: {_eq: $userId}}}}) {
    id
  }
}
`;

const getCampaignToEnd = `
query getCampaignToEnd($campaignId: uuid!) {
  campaign:campaign_by_pk(id: $campaignId) {
    id
    is_private
    is_ended
    deadline
    goal
    rewards {
      id
      pledge_amount
    }
    creator {
      id
      is_banned
    }
    pledges {
      id
      amount
      accept_rewards
      wallet {
        id
        useable_balance
        user {
          id
        }
      }
    }
    pledges_aggregate {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
}
`;

const setCampaignSuccessful = `
mutation setCampaignSuccesful($campaignId: uuid!, $pledgeIds: [uuid!]) {
  campaign: update_by_pk_campaign(
    pk_columns: { id: $campaignId }
    _set: { end_status: successful, is_ended: true }
  ) {
    id
    end_status
  }
  pledges: update_pledge(
    where: { id: { _in: $pledgeIds } }
    _set: { status: fulfilled }
  ) {
    affected_rows
  }
}
`;

const deliverReward = `
mutation deliverReward($userId: uuid!, $rewardId: uuid!) {
	user_reward:insert_user_eligible_rewards_one(object: {user_id: $userId, reward_id: $rewardId}) {
    id
  }
}
`;

const setCampaignFailed = `
mutation setCampaignFailed($campaignId: uuid!) {
  campaign: update_by_pk_campaign(
    pk_columns: { id: $campaignId }
    _set: { is_ended: true, end_status: failed }
  ) {
    id
    end_status
  }
}
`;

const reversePledge = `
mutation reversePledge(
  $pledgeId: uuid!
  $walletId: uuid!
  $startingBalance: numeric!
  $amount: numeric!
  $finalBalance: numeric!
  $transactionRemark: String!
) {
  wallet:update_by_pk_wallet(
    pk_columns: { id: $walletId }
    _inc: { useable_balance: $amount }
  ) {
    updated_at
    useable_balance
  }
  transaction:insert_transaction_one(
    object: {
      wallet_id: $walletId
      starting_balance: $startingBalance
      amount: $amount
      final_balance: $finalBalance
      remark: $transactionRemark
    }
  ) {
    id
  }
  pledge:update_by_pk_pledge(
    pk_columns: { id: $pledgeId }
    _set: { status: refunded }
  ) {
    id
    updated_at
    status
  }
}
`;

const getUserById = `query getUserById($userId: uuid!) {
  user(where: { id: { _eq: $userId } }) {
    id
    password_hash
    is_banned
  }
}
`;

const createWithdrawalRequest = `
mutation createWithdrawalRequest($campaignId: uuid!) {
  withdrawal_request:insert_withdrawal_request_one(object: {campaign_id: $campaignId}) {
    campaign_id
    id
    status
    updated_at
    created_at
  }
}
`;

const getWithdrawalRequest = `
query getWithdrawalRequestStats($requestId: uuid! = "4100c02d-88b8-42d4-b011-7cbea358d74a") {
  withdrawalRequest:withdrawal_request_by_pk(id: $requestId) {
    id
    status
    campaign {
      id
      pledges {
        id
        status
        amount
      }
      creator {
        id
        password_hash
        is_banned
        wallet {
          id
          useable_balance
        }
      }
    }
  }
}
`;

const withdrawalApprovalTransaction = `
mutation withdrawalApprovalTransaction(
  $requestId: uuid!
  $adminId: uuid!
  $pledgeIds: [uuid!]!
  $amount: numeric!
  $startingBalance: numeric!
  $finalBalance: numeric!
  $remark: String!
  $walletId: uuid!
) {
  withdrawalRequest: update_by_pk_withdrawal_request(
    pk_columns: { id: $requestId }
    _set: { status: withdrawn, handled_by: $adminId }
  ) {
    id
    status
  }
  pledges: update_pledge(
    where: { id: { _in: $pledgeIds } }
    _set: { status: withdrawn }
  ) {
    affected_rows
  }
  transaction: insert_transaction_one(
    object: {
      amount: $amount
      starting_balance: $startingBalance
      final_balance: $finalBalance
      remark: $remark
      wallet_id: $walletId
    }
  ) {
    id
  }
}
`;

const banUser = `
mutation banUser($userId: uuid!) {
  user:update_by_pk_user(pk_columns: {id: $userId}, _set: {is_banned: true}) {
    id
  }
}
`;

const campaignQueries = {
  getCampaignById,
  getCampaignInfo,
  getUserAndWallet,
  getUserPledge,
  backCampaign,
  addToPledge,
  getLikeAndDislikeByPk,
  addLike,
  removeLike,
  addDislike,
  removeDislike,
  likeToDislikeSwap,
  dislikeToLikeSwap,
  getCampaignPledgeStats,
  getCampaignCurrentUserStats,
  getCampaignToEnd,
  setCampaignSuccessful,
  deliverReward,
  setCampaignFailed,
  reversePledge,
  getUserById,
  createWithdrawalRequest,
  getWithdrawalRequest,
  withdrawalApprovalTransaction,
  banUser
};

module.exports = campaignQueries;
