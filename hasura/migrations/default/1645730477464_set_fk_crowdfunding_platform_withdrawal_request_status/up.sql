alter table "crowdfunding_platform"."withdrawal_request"
  add constraint "withdrawal_request_status_fkey"
  foreign key ("status")
  references "crowdfunding_platform"."withdrawal_request_status"
  ("status") on update cascade on delete restrict;
