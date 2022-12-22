alter table "crowdfunding_platform"."voucher" alter column "voucher_value_id" set default '7d5c7eb9-5749-4760-8dad-d3908d3aa59d'::uuid;
alter table "crowdfunding_platform"."voucher" alter column "voucher_value_id" drop not null;
alter table "crowdfunding_platform"."voucher" add column "voucher_value_id" uuid;
