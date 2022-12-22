const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const {
  findUser,
  createUser,
  createWallet,
  getUserById,
} = require('./helpers');
const { getRolePayload, defaultTokenOptions } = require('../requests/payloads');
const { verifyAction } = require('../globalHelpers');

/**
 * Sign in endpoint
 * Default Url = {root}/auth/login
 * ---------------------------------------------------------------------
 * Authentication endpoint for the signIn action
 *
 * Checks if a user with credentials matching those in the request exists
 * If a user is found, an accessToken is generated with the appropriate
 * roles and returned in the response along with other required data
 * If no user is found, or the credentials are incorrect, an error message
 * is returned.
 */
const signIn = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    const { emailAddress, password } = req.body.input;
    let authSuccess = false,
      token = '';

    try {
      const user = await findUser(emailAddress);
      if (user && (await argon2.verify(user.password_hash, password))) {
        token = jwt.sign(
          getRolePayload(user.id, user.role),
          process.env.JWT_SECRET,
          defaultTokenOptions
        );
        authSuccess = true;
      }

      if (authSuccess) {
        res.status(200).json({
          accessToken: token,
          userId: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          isVerified: user.is_verified,
          isBanned: user.is_banned,
          avatarUrl: user.avatar,
          displayName: user.display_name,
          role: user.role,
        });
      } else {
        res.status(401).json({
          message:
            'User authentication failed. Invalid email/password combination',
        });
      }
    } catch (err) {
      res.status(400).json({
        message: 'Invalid input. Please try again with a valid request body',
      });
    }
  });
};

/**
 * Signup authorization endpoint
 * Default Url = {root}/auth/signUp
 * ---------------------------------------------------------------------
 * Authentication endpoint for the signUp action
 *
 * Checks if a user with the same email address exists
 * If no user is found, a new user is created and the userId and accessToken
 * are returned in the response along with other required data
 * If a user is found, an error message is returned
 *
 * The default role is "user"
 */
const signUp = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    const { emailAddress, password, firstName, lastName, displayName, gender } =
      req.body.input;
    let token = '';

    try {
      let user = await findUser(emailAddress);
      if (user) {
        res.status(401).json({
          message:
            'User creation failed. A user with the provided email address already exists.',
        });
      } else {
        // Create a wallet for the user
        const wallet = await createWallet();
        const walletId = wallet.id;
        if (wallet) {
          const passwordHash = await argon2.hash(password);
          user = await createUser(
            emailAddress,
            passwordHash,
            firstName,
            lastName,
            displayName,
            gender,
            walletId
          );
          console.log(JSON.stringify(user));
          token = jwt.sign(
            getRolePayload(user.id, user.role),
            process.env.JWT_SECRET,
            defaultTokenOptions
          );
          res.status(200).json({
            accessToken: token,
            userId: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            displayName: user.display_name,
            gender: user.gender,
            role: user.role,
            isVerified: user.is_verified,
            isBanned: user.is_banned,
            avatarUrl: user.avatar,
          });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: 'Invalid input. Please try again with a valid request body',
      });
    }
  });
};

/**
 * Token refresh endpoint
 * Default Url = {root}/auth/refreshToken
 * ---------------------------------------------------------------------
 * Endpoint for the refreshToken action
 *
 * Verifies the authenticity and age (less than 7 days old)  of the oldToken
 * If token verification passes, a new token is generated and returned
 * If token verification fails, an error message is returned
 */
const refreshToken = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    try {
      const { oldToken } = req.body.input;
      jwt.verify(
        oldToken,
        process.env.JWT_SECRET,
        {
          ignoreExpiration: true,
          maxAge: process.env.TOKEN_REFRESH_TOLERANCE,
        },
        async function (err, decoded) {
          if (err) {
            res.status(401).json({
              message:
                'Invalid token. Please try logging in with a valid user account',
            });
          } else {
            const userId =
              decoded['https://hasura.io/jwt/claims']['x-hasura-user-id'];
            const user = await getUserById(userId);

            if (user) {
              const token = jwt.sign(
                getRolePayload(user.id, user.role),
                process.env.JWT_SECRET,
                defaultTokenOptions
              );
              res.status(200).json({
                newToken: token,
              });
            } else {
              res.status(404).json({
                message: 'Invalid token. Unable to find requested user',
              });
            }

            // TODO: Ensure account hasn't changed since token was issued before refreshing
            /* 
            const userUpdatedAt = Math.floor(new Date(user.updated_at) / 1000);
            if (decoded.iat > userUpdatedAt) {
              const token = jwt.sign(
                getRolePayload(user.id, user.role),
                process.env.JWT_SECRET,
                defaultTokenOptions
              );
              res.status(200).json({
                newToken: token,
              });
            } else {
              res.status(401).json({
                message:
                  'User account changed since token was issued. Please try logging in again to generate a new token',
                iat: decoded.iat,
                upd: userUpdatedAt,
              });
            }
            */
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: 'Invalid input. Please try again with a valid request body',
      });
    }
  });
};

const endpoints = {
  signIn,
  signUp,
  refreshToken,
};

module.exports = endpoints;
