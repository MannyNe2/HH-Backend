alter table "crowdfunding_platform"."wallet" add constraint "positive_balance_check" check (useable_balance >= 0);
