alter table "crowdfunding_platform"."campaign" add constraint "title_max_length" check (LENGTH(title) <= 100);
