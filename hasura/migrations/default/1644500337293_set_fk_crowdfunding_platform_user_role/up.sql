alter table "crowdfunding_platform"."user"
  add constraint "user_role_fkey"
  foreign key ("role")
  references "crowdfunding_platform"."user_role"
  ("role") on update cascade on delete restrict;
