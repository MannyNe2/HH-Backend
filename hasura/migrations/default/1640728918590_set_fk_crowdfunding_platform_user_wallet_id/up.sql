alter table "crowdfunding_platform"."user"
  add constraint "user_wallet_id_fkey"
  foreign key ("wallet_id")
  references "crowdfunding_platform"."wallet"
  ("id") on update restrict on delete restrict;
