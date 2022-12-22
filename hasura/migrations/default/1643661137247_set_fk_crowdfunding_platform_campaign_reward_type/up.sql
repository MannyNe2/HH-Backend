alter table "crowdfunding_platform"."campaign_reward"
  add constraint "campaign_reward_type_fkey"
  foreign key ("type")
  references "crowdfunding_platform"."reward_type"
  ("type") on update restrict on delete restrict;
