alter table "crowdfunding_platform"."campaign" add column "is_ended" boolean
 not null default 'false';
