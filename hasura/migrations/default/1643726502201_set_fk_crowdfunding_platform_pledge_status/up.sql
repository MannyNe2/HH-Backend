alter table "crowdfunding_platform"."pledge"
  add constraint "pledge_status_fkey"
  foreign key ("status")
  references "crowdfunding_platform"."pledge_status"
  ("status") on update restrict on delete restrict;
