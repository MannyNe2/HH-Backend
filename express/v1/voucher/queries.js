const saveVouchers = `
mutation saveVouchers($vouchers: [voucher_insert_input!]!) {
  insert_voucher(objects: $vouchers) {
    returning {
      id
    }
  }
}`;

const getUserById = `
query getUserById($userId: uuid!) {
  user(where: {id: {_eq: $userId}}) {
    is_banned
    wallet {
      id
      useable_balance
    }
  }
}`;

const getVoucher = `
query getVoucher($voucherCode: String!) {
  voucher(where: {code: {_ilike: $voucherCode}}) {
    id
    exp_date
    is_used
    value
  }
}`;

const consumeVoucher = `
mutation consumeVoucher($voucherId: uuid!) {
  update_by_pk_voucher(pk_columns: {id: $voucherId}, _set: {is_used: true}) {
    is_used
  }
}`;

const addFundsToWallet = `
mutation addFundsToWallet($amount: numeric!, $walletId: uuid!) {
  update_by_pk_wallet(_inc: {useable_balance: $amount}, pk_columns: {id: $walletId}) {
    useable_balance
  }
}`;

const logVoucherClaim = `
mutation logVoucherClaim($walletId: uuid!, $amount: numeric!, $startBalance: numeric!, $finalBalance: numeric!, $remark: String!) {
  insert_transaction_one(object: {wallet_id: $walletId, amount: $amount, starting_balance: $startBalance, final_balance: $finalBalance, remark: $remark}) {
    id
  }
}`;

const voucherQueries = {
  saveVouchers,
  getUserById,
  getVoucher,
  consumeVoucher,
  addFundsToWallet,
  logVoucherClaim
};
module.exports = voucherQueries;
