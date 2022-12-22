alter table "crowdfunding_platform"."pledge" add constraint "minimum_pledge" check (amount >= 1);
