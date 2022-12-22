alter table "crowdfunding_platform"."transaction" drop constraint "transaction_wallet_id_fkey",
  add constraint "transaction_wallet_id_fkey"
  foreign key ("wallet_id")
  references "crowdfunding_platform"."wallet"
  ("id") on update cascade on delete no action;
