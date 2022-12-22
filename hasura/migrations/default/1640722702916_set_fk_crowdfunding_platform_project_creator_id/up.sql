alter table "crowdfunding_platform"."project"
  add constraint "project_creator_id_fkey"
  foreign key ("creator_id")
  references "crowdfunding_platform"."user"
  ("id") on update restrict on delete restrict;
