alter table "crowdfunding_platform"."saved_campaign" add column "created_at" timestamptz
 null default now();
