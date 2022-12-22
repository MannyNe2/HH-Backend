const { verifyAction } = require('../globalHelpers');
const argon2 = require('argon2');
const {
  changePassword,
  validatePassword,
  getUserById,
  getPreviousCreatorRequests,
  addCreatorRequest,
} = require('./helpers');
const { differenceInDays } = require('date-fns');

const changePasswordEndpoint = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    try {
      const sessionVariables = req.body.session_variables;
      const { oldPassword, newPassword } = req.body.input;
      const userId = sessionVariables['x-hasura-user-id'];

      // Ensure the user's id is present
      if (!userId) {
        res.status(401).json({
          message: 'Internal error: Malformed request. Please check back later',
        });
        return;
      }

      // Ensure both oldPassword and newPassword have been provided
      if (!oldPassword || !newPassword) {
        res.status(401).json({
          message: 'Old password or new password not provided',
        });
        return;
      }

      // Ensure oldPassword and newPassword are different
      if (oldPassword.toLowerCase() === newPassword.toLowerCase()) {
        res.status(401).json({
          message: 'Old password and new password must be different',
        });
        return;
      }

      // Check validity of old password
      const user = await getUserById(userId);
      const passwordCorrect = await argon2.verify(
        user.password_hash,
        oldPassword
      );
      if (passwordCorrect) {
        // Validate password
        if (validatePassword(newPassword)) {
          const passwordHash = await argon2.hash(newPassword);
          const changedId = await changePassword(userId, passwordHash);
          // Ensure password was changed for the right account (should never actually come up as an issue)
          if (changedId === userId) {
            res.status(200).json({
              success: true,
              remark: 'Password successfuly changed',
            });
            return;
          } else {
            res.status(401).json({
              message:
                'Critical error: We REALLY messed up. Please contact an administrator NOW',
            });
            return;
          }
        } else {
          res.status(401).json({
            message: 'Invalid password',
          });
          return;
        }
      } else {
        res.status(401).json({
          message: 'Incorrect password',
        });
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: 'Critical error: Please try again later',
      });
    }
  });
};
const deleteAccount = async (req, res) => {
  verifyAction(req, res, async (req, res) => {});
};

const requestCreatorship = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    try {
      const creatorRequestCooldownInDays = 60;
      const sessionVariables = req.body.session_variables;
      const { password, image } = req.body.input;
      const userId = sessionVariables['x-hasura-user-id'];
      const userRole = sessionVariables['x-hasura-role'];

      // Ensure the user's id and role are present
      if (!userId || !userRole) {
        res.status(401).json({
          message: 'Internal error: Malformed request. Please check back later',
        });
        return;
      }

      if (userRole !== 'user') {
        res.status(401).json({
          message: `Error: ${userRole.capitalize()}s cannot apply to become creators`,
        });
        return;
      }

      // Ensure inputs are present
      if (!password || !image) {
        res.status(401).json({
          message: 'Error: Missing inputs',
        });
        return;
      }

      // Ensure password is correct and user is not already a creator
      const user = await getUserById(userId);
      const passwordCorrect = await argon2.verify(user.password_hash, password);
      if (!passwordCorrect) {
        res.status(401).json({
          message: 'Error: Incorrect password',
        });
        return;
      }

      // Fetch existing creator requests from user if any and only allow the request
      // if the user hasn't made one before or the last request is over 60 days old
      const previousRequests = await getPreviousCreatorRequests(userId);
      if (previousRequests.length > 0) {
        const previousRequestAge = differenceInDays(
          Date.now(),
          Date.parse(previousRequests[0].updated_at)
        );
        if (previousRequestAge < creatorRequestCooldownInDays) {
          res.status(401).json({
            message: `You need to wait ${creatorRequestCooldownInDays} days before making another creatorship request. (${
              creatorRequestCooldownInDays - previousRequestAge
            } days remaining)`,
          });
          return;
        }
      }

      // Add creator request to table
      const addedRequest = await addCreatorRequest(userId, image);
      if (!addedRequest.id) {
        res.status(400).json({
          message: 'Error: Unable to save request',
        });
        return;
      }

      res.status(200).json({
        requestId: addedRequest.id,
        status: addedRequest.status,
        created_at: `${addedRequest.created_at}`,
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
  changePasswordEndpoint,
  deleteAccount,
  requestCreatorship,
};

module.exports = endpoints;
