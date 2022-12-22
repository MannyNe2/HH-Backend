alter table "crowdfunding_platform"."campaign" add constraint "min_goal" check (goal >= 1);
