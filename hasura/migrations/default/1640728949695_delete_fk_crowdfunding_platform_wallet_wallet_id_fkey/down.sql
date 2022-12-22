alter table "crowdfunding_platform"."wallet"
  add constraint "wallet_id_fkey"
  foreign key ("id")
  references "crowdfunding_platform"."user"
  ("wallet_id") on update cascade on delete cascade;
