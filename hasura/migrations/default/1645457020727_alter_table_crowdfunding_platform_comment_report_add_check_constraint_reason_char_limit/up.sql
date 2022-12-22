alter table "crowdfunding_platform"."comment_report" add constraint "reason_char_limit" check (LENGTH(reason) <= 120);
