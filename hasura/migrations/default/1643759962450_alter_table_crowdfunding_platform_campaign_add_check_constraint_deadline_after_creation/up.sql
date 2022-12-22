alter table "crowdfunding_platform"."campaign" add constraint "deadline_after_creation" check (deadline > created_at);
