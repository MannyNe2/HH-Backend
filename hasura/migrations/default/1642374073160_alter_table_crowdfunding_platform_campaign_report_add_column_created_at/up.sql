alter table "crowdfunding_platform"."campaign_report" add column "created_at" timestamptz
 null default now();
