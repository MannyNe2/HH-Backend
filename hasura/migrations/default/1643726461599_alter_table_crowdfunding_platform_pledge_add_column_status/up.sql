alter table "crowdfunding_platform"."pledge" add column "status" text
 not null default 'pending';
