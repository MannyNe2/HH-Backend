alter table "crowdfunding_platform"."creator_request"
  add constraint "creator_request_status_fkey"
  foreign key ("status")
  references "crowdfunding_platform"."creator_request_status"
  ("status") on update cascade on delete restrict;
