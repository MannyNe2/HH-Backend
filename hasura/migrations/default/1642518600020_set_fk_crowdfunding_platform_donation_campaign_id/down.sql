alter table "crowdfunding_platform"."donation" drop constraint "donation_campaign_id_fkey",
  add constraint "donation_project_id_fkey"
  foreign key ("campaign_id")
  references "crowdfunding_platform"."transaction"
  ("id") on update cascade on delete no action;
