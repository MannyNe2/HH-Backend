alter table "crowdfunding_platform"."campaign"
  add constraint "campaign_end_status_fkey"
  foreign key ("end_status")
  references "crowdfunding_platform"."campaign_end_status"
  ("status") on update cascade on delete restrict;
