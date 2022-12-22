alter table "crowdfunding_platform"."campaign" add column "end_status" text
 not null default 'pending';
