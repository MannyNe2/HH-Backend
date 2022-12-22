const crypto = require('crypto');
const signedRequests = require('../requests/signedRequests');
const voucherQueries = require('./queries');

const generateCode = (length = 16) => {
  const AB = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  try {
    for (let i = 0; i < length; i++) {
      code += AB[crypto.randomInt(0, AB.length)];
    }
    return code ? code : false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const saveVouchers = async (codes) => {
  const variables = {
    vouchers: codes,
  };

  const data = (
    await signedRequests.api(voucherQueries.saveVouchers, variables)
  ).data;

  try {
    if (data.insert_voucher.returning.length === codes.length) {
      return true;
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

  const data = (await signedRequests.api(voucherQueries.getUserById, variables))
    .data;

  try {
    return data.user[0];
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getVoucher = async (code) => {
  const variables = {
    voucherCode: code,
  };

  const data = (await signedRequests.api(voucherQueries.getVoucher, variables))
    .data;

  try {
    return data.voucher[0];
  } catch (err) {
    console.log(err);
    return false;
  }
};

const consumeVoucher = async (voucherId) => {
  const variables = {
    voucherId: voucherId,
  };

  const data = (
    await signedRequests.api(voucherQueries.consumeVoucher, variables)
  ).data;

  try {
    return data.update_by_pk_voucher;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const addFundsToWallet = async (walletId, amount) => {
  const variables = {
    walletId: walletId,
    amount: amount,
  };

  const data = (
    await signedRequests.api(voucherQueries.addFundsToWallet, variables)
  ).data;

  try {
    return data.update_by_pk_wallet;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const logVoucherClaim = async (
  walletId,
  amount,
  oldBalance,
  newBalance,
  remark
) => {
  const variables = {
    walletId: walletId,
    amount: amount,
    startBalance: oldBalance,
    finalBalance: newBalance,
    remark: remark,
  };

  const data = (
    await signedRequests.api(voucherQueries.logVoucherClaim, variables)
  ).data;

  try {
    return data.insert_transaction_one;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  generateCode,
  saveVouchers,
  getUserById,
  getVoucher,
  consumeVoucher,
  addFundsToWallet,
  logVoucherClaim,
};
