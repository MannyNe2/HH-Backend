alter table "crowdfunding_platform"."comment_report" add column "created_at" timestamptz
 null default now();
