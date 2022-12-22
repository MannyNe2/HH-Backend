alter table "crowdfunding_platform"."campaign_report" add constraint "reason_char_limit" check (LENGTH(reason) <= 120);
