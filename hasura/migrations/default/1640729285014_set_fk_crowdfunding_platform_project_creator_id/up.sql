alter table "crowdfunding_platform"."project" drop constraint "project_creator_id_fkey",
  add constraint "project_creator_id_fkey"
  foreign key ("creator_id")
  references "crowdfunding_platform"."user"
  ("id") on update cascade on delete cascade;
