alter table "crowdfunding_platform"."voucher"
  add constraint "voucher_voucher_value_id_fkey"
  foreign key ("voucher_value_id")
  references "crowdfunding_platform"."voucher_value"
  ("id") on update cascade on delete cascade;
