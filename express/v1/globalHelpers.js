const verifyActionSecret = (req) => {
  try {
    const requestActionSecret = req.headers.action_secret;
    return requestActionSecret === process.env.ACTION_SECRET;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const verifyAction = (req, res, postCallback) => {
  if (verifyActionSecret(req)) {
    postCallback(req, res);
  } else {
    res.status(401).json({
      message: 'Unauthorized request',
    });
  }
};

const globalHelpers = {
  verifyAction
};

module.exports = globalHelpers;
