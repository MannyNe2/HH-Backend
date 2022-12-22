const argon2 = require('argon2');
const { compareAsc, parseISO } = require('date-fns');
const { verifyAction } = require('../globalHelpers');
const {
  getUserAndWallet,
  getCampaignById,
  getCampaignInfo,
  getUserPledge,
  backCampaignTransction,
  addToPledge,
  getLikeAndDislike,
  dislikeToLikeSwap,
  removeLike,
  addLike,
  likeToDislikeSwap,
  removeDislike,
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
  banUser,
} = require('./helpers');

const backCampaign = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    try {
      const sessionVariables = req.body.session_variables;
      let { campaignId, amount, acceptRewards } = req.body.input;
      const userId = sessionVariables['x-hasura-user-id'];
      const minimumPledge = 1;

      // Ensure required inputs are present
      if (!userId || !campaignId || !amount) {
        res.status(401).json({
          message: 'Malformed request. Please check back later',
        });
        return;
      }

      /* Validate Inputs */
      // Sanitize amount and enforce minimum pledge
      amount = Math.abs(amount);
      if (amount < 1) {
        res.status(401).json({
          message: `Pledge below the minimum of ${minimumPledge}`,
        });
        return;
      }

      // Get campaign and ensure the following:
      //     Campaign is public
      //     Creator is not banned
      //     Campaign isn't past its deadline
      //     Campaign hasn't ended
      const campaign = await getCampaignById(campaignId);
      if (!campaign || campaign.is_private) {
        res.status(401).json({
          message: 'Campaign not found',
        });
        return;
      }
      if (campaign.creator.is_banned) {
        res.status(401).json({
          message: 'Cannot back a campaign if the creator has been banned',
        });
        return;
      }
      if (campaign.is_ended) {
        res.status(401).json({
          message: 'Cannot back a campaign after it has ended',
        });
        return;
      }
      if (compareAsc(Date.now(), parseISO(campaign.deadline)) > 0) {
        res.status(401).json({
          message: 'Cannot back a campagin that is past its deadline',
        });
        return;
      } else {
        console.log('parsed: ' + Date.parse(campaign.deadline));
      }

      // Get user and ensure they are not banned
      const user = await getUserAndWallet(userId);
      if (!user) {
        res.status(401).json({
          message: 'User not found',
        });
        return;
      }
      if (user.is_banned) {
        res.status(401).json({
          message: 'User has been banned',
        });
        return;
      }

      // Ensure the user can afford to back the campaign for the given amount
      if (!user.wallet.id) {
        res.status(401).json({
          message:
            'Critical error: User has no wallet. Please contact an administrator immediately',
        });
        return;
      }
      if (user.wallet.useable_balance - amount < 0) {
        res.status(401).json({
          message: 'Insufficient funds',
        });
        return;
      }

      // Set default value for acceptRewards
      if (acceptRewards == undefined) {
        acceptRewards = true;
      }

      // Check if user has already pledged
      const walletId = user.wallet.id,
        startingBalance = user.wallet.useable_balance;
      const finalBalance = Number(startingBalance - amount).toFixed(2);

      const existingPledges = await getUserPledge(user.wallet.id, campaignId);
      const alreadyPledged = existingPledges.length > 0;

      // Check if any of the previous pledges have the same value for 'acceptRewards'
      // as the current pledge
      let matchingRewards = false;
      let pledgeId, existingPledgeAmount;

      matchingRewards = existingPledges.some((pledge) => {
        if (pledge.accept_rewards === acceptRewards) {
          pledgeId = pledge.id;
          existingPledgeAmount = pledge.amount;
          return true;
        }
      });

      if (alreadyPledged && matchingRewards) {
        /* Add amount to existing pledge with same value for acceptRewards */
        // Set the already existing value as the default for acceptRewards
        // Execute mutations
        const transactionRemark = `User ID ${userId} increased pledge from ${existingPledgeAmount} to ${
          amount + existingPledgeAmount
        } on existing pledge ID ${pledgeId}`;
        const result = await addToPledge(
          pledgeId,
          walletId,
          startingBalance,
          amount * -1,
          existingPledgeAmount + amount,
          finalBalance,
          acceptRewards,
          transactionRemark
        );
        if (result) {
          res.status(200).json({
            pledgeId: result.update_by_pk_pledge.id,
            transactionId: result.insert_transaction_one.id,
          });
        } else {
          res.status(401).json({
            message: 'Unable to complete transaction. No changes were made',
          });
        }
      } else {
        /* Create a new pledge */
        // Execute back campaign mutations
        const transactionRemark = `User ID ${userId} pledged ${amount} to campaign ID ${campaignId}`;
        const result = await backCampaignTransction(
          campaignId,
          walletId,
          startingBalance,
          amount * -1,
          finalBalance,
          acceptRewards,
          transactionRemark
        );
        if (result) {
          res.status(200).json({
            pledgeId: result.insert_pledge_one.id,
            transactionId: result.insert_transaction_one.id,
          });
        } else {
          res.status(401).json({
            message: 'Unable to complete transaction. No changes were made',
          });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: 'Critical error: Please try again later',
      });
    }
  });
};

const getSentiment = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    try {
      const { campaignId } = req.body.input;
      const role = req.body.session_variables['x-hasura-role'];
      if (!campaignId || !role) {
        res.status(401).json({
          message: 'Malformed request. Please check back later',
        });
        return;
      }
      const campaign = await getCampaignInfo(campaignId);

      // If campaign is private:
      //    if request is from an admin or the creator, allow
      //    else deny
      if (campaign.is_private) {
        if (role === 'admin' || role === 'creator') {
          if (role === 'creator') {
            const userId = req.body.session_variables['x-hasura-user-id'];
            if (!userId) {
              res.status(401).json({
                message: 'Malformed request. Please check back later',
              });
              return;
            } else if (userId !== campaign.creator.id) {
              res.status(401).json({
                message: 'Campaign not found',
              });
            }
          }
          res.status(200).json({
            id: campaignId,
            likes: campaign.likes_aggregate.aggregate.count,
            dislikes: campaign.dislikes_aggregate.aggregate.count,
          });
          return;
        }
        res.status(401).json({
          message: 'Campaign not found',
        });
        return;
      }
      // If campaign is not private, allow
      else {
        res.status(200).json({
          id: campaignId,
          likes: campaign.likes_aggregate.aggregate.count,
          dislikes: campaign.dislikes_aggregate.aggregate.count,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: 'Critical error: Please try again later',
      });
    }
  });
};

const like = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    /**
     * If dislike exists, swap for like
     * otherwise if like exists, remove like
     * otherwise add like
     */
    try {
      const { campaignId } = req.body.input;
      const userId = req.body.session_variables['x-hasura-user-id'];
      if (!campaignId || !userId) {
        res.status(401).json({
          message: 'Malformed request. Please check back later',
        });
        return;
      }

      const userSentiment = await getLikeAndDislike(campaignId, userId);

      if (userSentiment.dislike) {
        // Dislike exists
        const finalState = dislikeToLikeSwap(campaignId, userId);
        console.log(userSentiment.totalDislikes);
        if (finalState) {
          res.status(200).json({
            liked: true,
            likesCount: userSentiment.totalLikes + 1,
            dislikesCount: userSentiment.totalDislikes - 1,
          });
          return;
        } else {
          res.status(401).json({
            message: 'Unable to perform operation',
          });
          return;
        }
      } else if (userSentiment.like) {
        // Like exists
        const likeRemoved = removeLike(campaignId, userId);
        if (likeRemoved) {
          res.status(200).json({
            liked: false,
            likesCount: userSentiment.totalLikes - 1,
            dislikesCount: userSentiment.totalDislikes,
          });
          return;
        } else {
          res.status(401).json({
            message: 'Unable to perform operation',
          });
          return;
        }
      } else {
        // Neither exist
        const likeAdded = addLike(campaignId, userId);
        if (likeAdded) {
          res.status(200).json({
            liked: true,
            likesCount: userSentiment.totalLikes + 1,
            dislikesCount: userSentiment.totalDislikes,
          });
          return;
        } else {
          res.status(401).json({
            message: 'Unable to perform operation',
          });
          return;
        }
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: 'Critical error: Please try again later',
      });
    }
  });
};

const dislike = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    /**
     * If like exists, swap for dislike
     * otherwise if dislike exists, remove dislike
     * otherwise, add dislike
     */
    try {
      const { campaignId } = req.body.input;
      const userId = req.body.session_variables['x-hasura-user-id'];
      if (!campaignId || !userId) {
        res.status(401).json({
          message: 'Malformed request. Please check back later',
        });
        return;
      }

      const userSentiment = await getLikeAndDislike(campaignId, userId);

      if (userSentiment.like) {
        // Like exists
        const finalState = likeToDislikeSwap(campaignId, userId);
        if (finalState) {
          res.status(200).json({
            disliked: true,
            likesCount: userSentiment.totalLikes - 1,
            dislikesCount: userSentiment.totalDislikes + 1,
          });
          return;
        } else {
          res.status(401).json({
            message: 'Unable to perform operation',
          });
          return;
        }
      } else if (userSentiment.dislike) {
        // Dislike exists
        const dislikeRemoved = removeDislike(campaignId, userId);
        if (dislikeRemoved) {
          res.status(200).json({
            disliked: false,
            likesCount: userSentiment.totalLikes,
            dislikesCount: userSentiment.totalDislikes - 1,
          });
          return;
        } else {
          res.status(401).json({
            message: 'Unable to perform operation',
          });
          return;
        }
      } else {
        // Neither exist
        const dislikeAdded = addDislike(campaignId, userId);
        if (dislikeAdded) {
          res.status(200).json({
            disliked: true,
            likesCount: userSentiment.totalLikes,
            dislikesCount: userSentiment.totalDislikes + 1,
          });
          return;
        } else {
          res.status(401).json({
            message: 'Unable to perform operation',
          });
          return;
        }
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: 'Critical error: Please try again later',
      });
    }
  });
};

const getStats = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    try {
      const { campaignId } = req.body.input;
      const role = req.body.session_variables['x-hasura-role'];
      const userId = req.body.session_variables['x-hasura-user-id'];
      if (!campaignId || !role) {
        res.status(401).json({
          message: 'Malformed request. Please check back later',
        });
        return;
      }
      // Deny if campaign is private and requestor is not the creator or an admin
      const campaign = await getCampaignInfo(campaignId);
      if (campaign.is_private) {
        if (role === 'admin' || role === 'creator') {
          if (role === 'creator') {
            if (!userId) {
              res.status(401).json({
                message: 'Malformed request. Please check back later',
              });
              return;
            } else if (userId !== campaign.creator.id) {
              res.status(401).json({
                message: 'Campaign not found',
              });
              return;
            }
          }
          const stats = await getCampaignStats(campaignId);
          currentUserRelation = await getCurrentUserCampaignStats(
            userId,
            campaignId
          );
          if (!currentUserRelation) currentUserRelation = null;
          if (stats) {
            res.status(200).json({
              backersCount: stats.count,
              totalAmount: stats.sum ? stats.sum : 0,
              currentUserRelation: currentUserRelation
                ? JSON.stringify(currentUserRelation)
                : null,
            });
            return;
          } else {
            res.status(401).json({
              message: 'Campaign not found',
            });
            return;
          }
        }
        res.status(401).json({
          message: 'Campaign not found',
        });
        return;
      }
      // Else allow
      else {
        const stats = await getCampaignStats(campaignId);
        if (stats) {
          let currentUserRelation = null;
          if (role === 'admin' || role === 'user' || role === 'creator') {
            currentUserRelation = await getCurrentUserCampaignStats(
              userId,
              campaignId
            );
            if (!currentUserRelation) currentUserRelation = null;
          }

          res.status(200).json({
            backersCount: stats.count,
            totalAmount: stats.sum ? stats.sum : 0,
            currentUserRelation: currentUserRelation
              ? JSON.stringify(currentUserRelation)
              : null,
          });
          return;
        } else {
          res.status(401).json({
            message: 'Campaign not found',
          });
          return;
        }
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: 'Critical error: Please try again later',
      });
    }
  });
};

const end = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    try {
      const { campaignId, status, password } = req.body.input;
      const role = req.body.session_variables['x-hasura-role'];
      const userId = req.body.session_variables['x-hasura-user-id'];

      if (!(role && userId)) {
        res.status(401).json({
          message: 'Malformed request. Please check back later',
        });
        return;
      }

      if (!(campaignId && status && password)) {
        res.status(401).json({
          message: 'Missing or invalid inputs',
        });
        return;
      }

      // Ensure provided password is correct
      const user = await getUserById(userId);
      if (!(await argon2.verify(user.password_hash, password))) {
        res.status(401).json({
          message: `Incorrect password`,
        });
        return;
      }

      // Ensure the user is not banned
      if (user.is_banned) {
        res.status(401).json({
          message: `Creator has been banned`,
        });
        return;
      }

      // Ensure user is a creator
      if (role !== 'creator') {
        res.status(401).json({
          message: 'Non creators cannot end campaigns',
        });
        return;
      }

      // Ensure requested end status is valid
      if (!(status === 'successful' || status === 'failed')) {
        res.status(401).json({
          message: 'Invalid end status provided',
        });
        return;
      }

      // Get campaign and check if
      //  - Campaign exists
      //  - Campaign is public
      //  - User is the campaign's creator
      //  - User is not banned
      //  - Campaign has not already ended
      //  - Campaign is not past its deadline
      const campaign = await getCampaignToEnd(campaignId);
      if (!campaign || campaign.is_private) {
        res.status(401).json({
          message: 'Campaign not found',
        });
        return;
      }
      if (campaign.creator.id !== userId || campaign.creator.is_banned) {
        res.status(401).json({
          message: 'Permission denied',
        });
        return;
      }
      if (campaign.is_ended) {
        res.status(401).json({
          message: 'Campaign has already ended',
        });
      }
      if (compareAsc(Date.now(), parseISO(campaign.deadline)) > 0) {
        res.status(401).json({
          message: 'Cannot end an expired campaign',
        });
        return;
      }

      // Campaign was a failure
      if (status === 'failed') {
        const failResult = await setCampaignFailed(campaignId);
        if (!failResult) {
          res.status(401).json({
            message: 'Unable to end campaign. Please try again later',
          });
          return;
        }
        campaign.pledges.list.forEach(async (pledge) => {
          await reversePledge(
            pledge.id,
            pledge.wallet.id,
            pledge.wallet.useable_balance,
            pledge.amount,
            pledge.wallet.useable_balance + pledge.amount,
            `User ID ${pledge.wallet.user.id} was refunded their ${pledge.amount} pledge ID ${pledge.id} to campaign ID ${campaignId}`
          );
        });
        res.status(200).json({
          campaignId: campaignId,
          endStatus: status,
        });
        return;
      }

      // Campaign was a success
      if (campaign.pledges.list.length === 0) {
        res.status(401).json({
          message: 'Cannot end a campaign with no backers as a success',
        });
        return;
      }
      if (campaign.pledges.totalPledged < campaign.goal) {
        res.status(401).json({
          message:
            'Cannot end a campaign as a success if it has not met its goal',
        });
        return;
      }

      const successResult = await setCampaignSuccesful(
        campaignId,
        campaign.pledges.list.map((pledge) => pledge.id)
      );
      if (!successResult) {
        res.status(401).json({
          message: 'Unable to end campaign. Please try again later',
        });
        return;
      }
      campaign.pledges.list.forEach((pledge) => {
        if (pledge.accept_rewards) {
          campaign.rewards.forEach(async (reward) => {
            if (pledge.amount >= reward.pledge_amount) {
              await deliverReward(pledge.wallet.user.id, reward.id);
            }
          });
        }
      });
      res.status(200).json({
        campaignId: campaignId,
        endStatus: status,
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: 'Critical error: Please try again later',
      });
      return;
    }
  });
};

const withdrawFunds = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    try {
      const { campaignId, password } = req.body.input;
      const role = req.body.session_variables['x-hasura-role'];
      const userId = req.body.session_variables['x-hasura-user-id'];

      if (!(role && userId)) {
        res.status(401).json({
          message: 'Malformed request. Please check back later',
        });
        return;
      }

      if (!(campaignId && password)) {
        res.status(401).json({
          message: 'Missing or invalid inputs',
        });
        return;
      }

      // Ensure provided password is correct
      const user = await getUserById(userId);
      if (!(await argon2.verify(user.password_hash, password))) {
        res.status(401).json({
          message: `Incorrect password`,
        });
        return;
      }

      // Ensure user is a creator
      if (role !== 'creator') {
        res.status(401).json({
          message: 'Non creators cannot end campaigns',
        });
        return;
      }

      if (user.is_banned) {
        res.status(401).json({
          message: 'Creator has been banned',
        });
        return;
      }

      // Ensure campaign exists and creator owns campaign
      const campaign = await getCampaignById(campaignId);
      if (!campaign) {
        res.status(401).json({
          message: 'Campaign not found',
        });
        return;
      }
      if (campaign.creator.id !== userId) {
        res.status(401).json({
          message: campaign.is_private
            ? 'Campaign not found'
            : 'Permission denied',
        });
        return;
      }

      // Ensure campaign is eligible for withdrawal
      if (!(campaign.is_ended && campaign.end_status === 'successful')) {
        res.status(401).json({
          message: 'Campaign is ineligible for fund withdrawal',
        });
        return;
      }

      // Attempt to insert withdrawal request entry
      const withdrawalRequest = await createWithdrawalRequest(campaignId);
      if (!withdrawalRequest) {
        res.status(401).json({
          message:
            'Withdrawal request either already exists or could not be created',
        });
        return;
      }
      res.status(200).json({
        id: withdrawalRequest.id,
        campaignId: withdrawalRequest.campaign_id,
        status: withdrawalRequest.status,
        createdAt: withdrawalRequest.created_at,
        updatedAt: withdrawalRequest.updated_at,
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: 'Critical error: Please try again later',
      });
      return;
    }
  });
};

const approveWithdrawal = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    try {
      const { withdrawalRequestId, adminPassword, creatorPassword } =
        req.body.input;
      const adminId = req.body.session_variables['x-hasura-user-id'];

      if (!adminId) {
        res.status(401).json({
          message: 'Malformed request. Please check back later',
        });
        return;
      }

      if (!(withdrawalRequestId && adminPassword && creatorPassword)) {
        res.status(401).json({
          message: 'Missing or invalid inputs',
        });
        return;
      }

      // Ensure provided admin password is correct
      const admin = await getUserById(adminId);
      if (!(await argon2.verify(admin.password_hash, adminPassword))) {
        res.status(401).json({
          message: `Incorrect admin password`,
        });
        return;
      }

      // Get withdrawal request with creator and pledge info
      const withdrawalRequest = await getWithdrawalRequest(withdrawalRequestId);
      if (!withdrawalRequest) {
        res.status(401).json({
          message: 'Unable to fetch withdrawal request',
        });
      }

      // Ensure creator isn't banned
      if (withdrawalRequest.campaign.creator.is_banned) {
        res.status(401).json({
          message: 'Creator has been banned',
        });
        return;
      }

      if (withdrawalRequest.status === 'withdrawn') {
        res.status(401).json({
          message: 'Cannot withdraw more than once from a single request',
        });
        return;
      }

      // Ensure provided creator password is correct
      if (
        !(await argon2.verify(
          withdrawalRequest.campaign.creator.password_hash,
          creatorPassword
        ))
      ) {
        res.status(401).json({
          message: `Incorrect creator password`,
        });
        return;
      }

      // Extract pledge data
      let pledgeIds = [],
        totalPledged = 0;
      withdrawalRequest.campaign.pledges.forEach((pledge) => {
        pledgeIds.push(pledge.id);
        totalPledged += pledge.amount;
      });

      const transactionRemark = `Creator ID: ${withdrawalRequest.campaign.creator.id} withdrew ${totalPledged} Br pledged to campaign ID: ${withdrawalRequest.campaign.id}`;

      // Withdrawal approval transaction
      const approval = await withdrawalApprovalTransaction(
        withdrawalRequestId,
        adminId,
        withdrawalRequest.campaign.pledges.map((pledge) => pledge.id),
        totalPledged,
        withdrawalRequest.campaign.creator.wallet.useable_balance,
        withdrawalRequest.campaign.creator.wallet.useable_balance,
        transactionRemark,
        withdrawalRequest.campaign.creator.wallet.id
      );

      if (!approval) {
        res.status(401).json({
          message: 'Unable to approve withdrawal',
        });
        return;
      }

      res.status(200).json({
        withdrawalRequestId: withdrawalRequestId,
        status: approval.withdrawalRequest.status,
        handlerId: adminId,
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: 'Critical error: Please try again later',
      });
      return;
    }
  });
};

const forceStopCampaign = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    try {
      const { campaignId, banCreator, password } = req.body.input;
      const adminId = req.body.session_variables['x-hasura-user-id'];

      if (!adminId) {
        res.status(401).json({
          message: 'Malformed request. Please check back later',
        });
        return;
      }

      if (!(campaignId && password)) {
        res.status(401).json({
          message: 'Missing or invalid inputs',
        });
        return;
      }

      let banCreatorCheck = banCreator === undefined ? true : banCreator;

      // Ensure provided password is correct
      const admin = await getUserById(adminId);
      if (!(await argon2.verify(admin.password_hash, password))) {
        res.status(401).json({
          message: `Incorrect password`,
        });
        return;
      }

      // Get campaign and ensure it hasn't already ended
      const campaign = await getCampaignToEnd(campaignId);
      if (!campaign) {
        res.status(401).json({
          message: 'Campaign not found',
        });
        return;
      }

      // Ban the campaign creator if banCreator is true
      let success = false;
      if (banCreatorCheck) {
        const res = await banUser(campaign.creator.id);
        if (res) {
          success = true;
        }
      }

      // End campaign as a failure
      if (campaign.is_ended) {
        res.status(401).json({
          message: 'Campaign already ended' + (success ? ', creator has been banned' : ''),
        });
        return;
      }

      // End campaign
      const failResult = await setCampaignFailed(campaignId);
      if (!failResult) {
        res.status(401).json({
          message: 'Unable to end campaign. Please try again later',
        });
        return;
      }
      campaign.pledges.list.forEach(async (pledge) => {
        await reversePledge(
          pledge.id,
          pledge.wallet.id,
          pledge.wallet.useable_balance,
          pledge.amount,
          pledge.wallet.useable_balance + pledge.amount,
          `User ID ${pledge.wallet.user.id} was refunded their ${pledge.amount} pledge ID ${pledge.id} to campaign ID ${campaignId}`
        );
      });
      res.status(200).json({
        campaignId: campaignId,
        success: success && true,
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: 'Critical error: Please try again later',
      });
      return;
    }
  });
};

const endpoints = {
  backCampaign,
  getSentiment,
  like,
  dislike,
  getStats,
  end,
  withdrawFunds,
  approveWithdrawal,
  forceStopCampaign,
};

module.exports = endpoints;
