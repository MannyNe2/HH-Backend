CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "crowdfunding_platform"."voucher" add column "voucher_value_id" uuid
 not null default '7d5c7eb9-5749-4760-8dad-d3908d3aa59d';
