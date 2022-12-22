alter table "crowdfunding_platform"."user" add constraint "gender_validation" check (lower(crowdfunding_platform.user.gender) in ('male', 'female', 'non-binary'));
