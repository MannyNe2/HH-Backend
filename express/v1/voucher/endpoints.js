const { verifyAction } = require('../globalHelpers');
const {
  generateCode,
  saveVouchers,
  getUserById,
  getVoucher,
  consumeVoucher,
  addFundsToWallet,
  logVoucherClaim,
} = require('./helpers');

const claim = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    try {
      // TODO: FIX POSSIBLE EXCEPTIONS
      const sessionVariables = req.body.session_variables;
      const userId = sessionVariables['x-hasura-user-id'];
      const userRole = sessionVariables['x-hasura-role'];
      const { voucherCode } = req.body.input;

      // Ensure the user's id and role are sent
      if (!userId || !userRole) {
        res.status(401).json({
          message: 'Internal error: Malformed request. Please check back later',
        });
      }

      // Ensure user exists
      const user = await getUserById(userId);
      if (!user) {
        res.status(401).json({
          message: 'User does not exist',
        });
        return;
      }
      const oldBalance = user.wallet.useable_balance;

      // Voucher validation
      const voucher = await getVoucher(voucherCode);
      if (!voucher) {
        // Ensure voucher code exists
        res.status(401).json({
          message: 'Invalid voucher code',
        });
        return;
      }

      if (voucher.is_used) {
        // Ensure voucher hasn't been used
        res.status(401).json({
          message: 'Voucher already used',
        });
        return;
      }

      if (Date.parse(voucher.exp_date) < Date.now()) {
        // Ensure voucher hasn't expired
        res.status(401).json({
          message: 'Voucher expired',
        });
        return;
      }

      // Consume voucher code (mark as used)
      const voucherConsumptionStatus = await consumeVoucher(voucher.id);
      if (!voucherConsumptionStatus || !voucherConsumptionStatus.is_used) {
        res.status(401).json({
          message:
            'Internal error: Cannot claim voucher. Please try again later',
        });
        return;
      }

      // Add voucher's value to the user's wallet
      const addFundsToWalletStatus = await addFundsToWallet(
        user.wallet.id,
        voucher.value
      );
      if (!addFundsToWalletStatus || !addFundsToWalletStatus.useable_balance) {
        res.status(401).json({
          message:
            'Internal error: Cannot add funds to wallet. Voucher has been consumed, please contact an administrator',
        });
        return;
      }
      const newBalance = addFundsToWalletStatus.useable_balance;

      // Log voucher claim as a transaction
      const transactionStatus = await logVoucherClaim(
        user.wallet.id,
        voucher.value,
        oldBalance,
        newBalance,
        `User of wallet id: ${user.wallet.id} claimed voucher id: ${voucher.id} value: ${voucher.value}`
      );

      if (!transactionStatus || !transactionStatus.id) {
        console.log(
          `Unable to log transaction: User of wallet id: ${user.wallet.id} claimed voucher id: ${voucher.id} value: ${voucher.value}`
        );
      }

      res.status(200).json({
        success: true,
        remark: "Voucher redeemed"
      });
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: 'Critical error: Please try again later',
      });
    }
  });
};

const generate = async (req, res) => {
  verifyAction(req, res, async (req, res) => {
    let { codeLength, count, value } = req.body.input;
    if (!count || count < 1) {
      count = 1;
    }

    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push({
        code: generateCode(codeLength),
        value: value,
      });
    }
    const success = saveVouchers(codes);
    if (success) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(401).json({
        message: 'Internal error: Unable to generate voucher codes',
      });
    }
  });
};

const endpoints = {
  claim,
  generate,
};
module.exports = endpoints;
