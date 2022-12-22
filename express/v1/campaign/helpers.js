const signedRequests = require('../requests/signedRequests');
const campaignQueries = require('./queries');

const getUserAndWallet = async (userId) => {
  const variables = {
    userId: userId,
  };

  const data = (
    await signedRequests.api(campaignQueries.getUserAndWallet, variables)
  ).data;

  try {
    return data.user_by_pk;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getCampaignById = async (campaignId) => {
  const variables = {
    campaignId: campaignId,
  };

  const data = (
    await signedRequests.api(campaignQueries.getCampaignById, variables)
  ).data;

  try {
    return data.campaign_by_pk;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getCampaignInfo = async (campaignId) => {
  const variables = {
    campaignId: campaignId,
  };

  const data = (
    await signedRequests.api(campaignQueries.getCampaignInfo, variables)
  ).data;

  try {
    return data.campaign_by_pk;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getUserPledge = async (walletId, campaignId) => {
  const variables = {
    walletId: walletId,
    campaignId: campaignId,
  };

  const data = (
    await signedRequests.api(campaignQueries.getUserPledge, variables)
  ).data;

  try {
    return data.pledge;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const backCampaignTransction = async (
  campaignId,
  walletId,
  startingBalance,
  amount,
  finalBalance,
  acceptRewards,
  transactionRemark
) => {
  const variables = {
    campaignId: campaignId,
    walletId: walletId,
    startingBalance: startingBalance,
    amount: amount,
    finalBalance: finalBalance,
    amount: amount,
    acceptRewards: acceptRewards,
    transactionRemark: transactionRemark,
  };

  const data = (
    await signedRequests.api(campaignQueries.backCampaign, variables)
  ).data;

  try {
    if (
      data.update_by_pk_wallet &&
      data.insert_pledge_one &&
      data.insert_transaction_one
    ) {
      return data;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const addToPledge = async (
  pledgeId,
  walletId,
  startingBalance,
  transactionAmount,
  finalPledgedAmount,
  finalBalance,
  acceptRewards,
  transactionRemark
) => {
  const variables = {
    pledgeId: pledgeId,
    walletId: walletId,
    startingBalance: startingBalance,
    transactionAmount: transactionAmount,
    finalPledgedAmount: finalPledgedAmount,
    finalBalance: finalBalance,
    acceptRewards: acceptRewards,
    transactionRemark: transactionRemark,
  };

  const data = (
    await signedRequests.api(campaignQueries.addToPledge, variables)
  ).data;

  try {
    if (
      data.update_by_pk_wallet &&
      data.update_by_pk_pledge &&
      data.insert_transaction_one
    ) {
      return data;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getLikeAndDislike = async (campaignId, userId) => {
  try {
    const variables = {
      campaignId: campaignId,
      userId: userId,
    };
    const data = (
      await signedRequests.api(campaignQueries.getLikeAndDislikeByPk, variables)
    ).data;
    return {
      like: data.campaign_like_by_pk,
      dislike: data.campaign_dislike_by_pk,
      totalLikes: data.campaign_like_aggregate.aggregate.count,
      totalDislikes: data.campaign_dislike_aggregate.aggregate.count,
    };
  } catch (err) {
    console.log(err);
    return false;
  }
};

const dislikeToLikeSwap = async (campaignId, userId) => {
  try {
    const variables = {
      campaignId: campaignId,
      userId: userId,
    };
    const data = (
      await signedRequests.api(campaignQueries.dislikeToLikeSwap, variables)
    ).data;
    if (data.delete_by_pk_campaign_dislike && data.insert_campaign_like_one) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
const likeToDislikeSwap = async (campaignId, userId) => {
  try {
    const variables = {
      campaignId: campaignId,
      userId: userId,
    };
    const data = (
      await signedRequests.api(campaignQueries.likeToDislikeSwap, variables)
    ).data;
    if (data.delete_by_pk_campaign_like && data.insert_campaign_dislike_one) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const removeLike = async (campaignId, userId) => {
  try {
    const variables = {
      campaignId: campaignId,
      userId: userId,
    };
    const data = (
      await signedRequests.api(campaignQueries.removeLike, variables)
    ).data;
    if (data.delete_by_pk_campaign_like) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
const removeDislike = async (campaignId, userId) => {
  try {
    const variables = {
      campaignId: campaignId,
      userId: userId,
    };
    const data = (
      await signedRequests.api(campaignQueries.removeDislike, variables)
    ).data;
    if (data.delete_by_pk_campaign_dislike) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
const addLike = async (campaignId, userId) => {
  try {
    const variables = {
      campaignId: campaignId,
      userId: userId,
    };
    const data = (await signedRequests.api(campaignQueries.addLike, variables))
      .data;
    if (data.insert_campaign_like_one) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
const addDislike = async (campaignId, userId) => {
  try {
    const variables = {
      campaignId: campaignId,
      userId: userId,
    };
    const data = (
      await signedRequests.api(campaignQueries.addDislike, variables)
    ).data;
    if (data.insert_campaign_dislike_one) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getCampaignStats = async (campaignId) => {
  try {
    const variables = {
      campaignId: campaignId,
    };
    const data = (
      await signedRequests.api(
        campaignQueries.getCampaignPledgeStats,
        variables
      )
    ).data;
    if (data.campaign_by_pk) {
      return {
        count: data.campaign_by_pk.pledges_count.aggregate.count,
        sum: data.campaign_by_pk.pledges_sum.aggregate.sum.amount,
      };
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getCurrentUserCampaignStats = async (userId, campaignId) => {
  try {
    const variables = {
      campaignId: campaignId,
      userId: userId,
    };
    const data = (
      await signedRequests.api(
        campaignQueries.getCampaignCurrentUserStats,
        variables
      )
    ).data;

    if (data) {
      return {
        liked: data.campaign_like_by_pk ? true : false,
        disliked: data.campaign_dislike_by_pk ? true : false,
        saved: data.saved_campaign_by_pk ? true : false,
        pledge: {
          exists: data.pledge.length > 0,
          id: data.pledge.length > 0 ? data.pledge[0].id : null,
        },
      };
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getCampaignToEnd = async (campaignId) => {
  try {
    const variables = {
      campaignId: campaignId,
    };

    const data = (
      await signedRequests.api(campaignQueries.getCampaignToEnd, variables)
    ).data;

    if (data) {
      const totalPledged = data.campaign.pledges_aggregate.aggregate.sum.amount;
      return {
        id: data.campaign.id,
        is_private: data.campaign.is_private,
        is_ended: data.campaign.is_ended,
        deadline: data.campaign.deadline,
        goal: data.campaign.goal,
        rewards: data.campaign.rewards,
        creator: data.campaign.creator,
        pledges: {
          list: data.campaign.pledges,
          totalPledged: totalPledged ? totalPledged : 0,
        },
      };
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const setCampaignSuccesful = async (campaignId, pledgeIds) => {
  try {
    const variables = {
      campaignId: campaignId,
      pledgeIds: pledgeIds,
    };

    const data = (
      await signedRequests.api(campaignQueries.setCampaignSuccessful, variables)
    ).data;

    if (data && data.campaign && data.pledges) {
      return data;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const deliverReward = async (userId, rewardId) => {
  try {
    const variables = {
      userId: userId,
      rewardId: rewardId,
    };

    const data = (
      await signedRequests.api(campaignQueries.deliverReward, variables)
    ).data;

    if (data && data.user_reward) {
      return data.user_reward;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const setCampaignFailed = async (campaignId) => {
  try {
    const variables = {
      campaignId: campaignId,
    };

    const data = (
      await signedRequests.api(campaignQueries.setCampaignFailed, variables)
    ).data;

    if (data && data.campaign) {
      return data.campaign;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const reversePledge = async (
  pledgeId,
  walletId,
  startingBalance,
  amount,
  finalBalance,
  transactionRemark
) => {
  try {
    const variables = {
      pledgeId: pledgeId,
      walletId: walletId,
      startingBalance: startingBalance,
      amount: amount,
      finalBalance: finalBalance,
      transactionRemark: transactionRemark,
    };

    const data = (
      await signedRequests.api(campaignQueries.reversePledge, variables)
    ).data;

    if (data && data.wallet && data.transaction && data.pledge) {
      return data;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getUserById = async (userId) => {
  const variables = {
    userId: userId,
  };
  try {
    const data = (
      await signedRequests.api(campaignQueries.getUserById, variables)
    ).data;
    if (data && data.user[0]) {
      return data.user[0];
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const createWithdrawalRequest = async (campaignId) => {
  const variables = {
    campaignId: campaignId,
  };
  try {
    const data = (
      await signedRequests.api(
        campaignQueries.createWithdrawalRequest,
        variables
      )
    ).data;
    if (data && data.withdrawal_request) {
      return data.withdrawal_request;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getWithdrawalRequest = async (requestId) => {
  const variables = {
    requestId: requestId,
  };
  try {
    const data = (
      await signedRequests.api(campaignQueries.getWithdrawalRequest, variables)
    ).data;
    if (data && data.withdrawalRequest) {
      return data.withdrawalRequest;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const withdrawalApprovalTransaction = async (
  requestId,
  adminId,
  pledgeIds,
  amount,
  startingBalance,
  finalBalance,
  remark,
  walletId
) => {
  const variables = {
    requestId: requestId,
    adminId: adminId,
    pledgeIds: pledgeIds,
    amount: amount,
    startingBalance: startingBalance,
    finalBalance: finalBalance,
    remark: remark,
    walletId: walletId,
  };
  try {
    const data = (
      await signedRequests.api(
        campaignQueries.withdrawalApprovalTransaction,
        variables
      )
    ).data;
    if (data && data.withdrawalRequest && data.pledges && data.transaction) {
      return {
        withdrawalRequest: data.withdrawalRequest,
        pledges: data.pledges,
        transaction: data.transaction,
      };
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const banUser = async (userId) => {
  const variables = {
    userId: userId,
  };
  try {
    const data = (
      await signedRequests.api(campaignQueries.banUser, variables)
    ).data;
    if (data && data.user) {
      return data.user;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  getUserAndWallet,
  getCampaignById,
  getCampaignInfo,
  getUserPledge,
  backCampaignTransction,
  addToPledge,
  getLikeAndDislike,
  dislikeToLikeSwap,
  likeToDislikeSwap,
  removeLike,
  removeDislike,
  addLike,
  addDislike,
  getCampaignStats,
  getCurrentUserCampaignStats,
  getCampaignToEnd,
  setCampaignSuccesful,
  deliverReward,
  setCampaignFailed,
  reversePledge,
  getUserById,
  createWithdrawalRequest,
  getWithdrawalRequest,
  withdrawalApprovalTransaction,
  banUser
};
