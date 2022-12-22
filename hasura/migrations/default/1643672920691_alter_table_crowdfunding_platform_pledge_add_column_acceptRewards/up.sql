alter table "crowdfunding_platform"."pledge" add column "acceptRewards" boolean
 not null default 'true';
