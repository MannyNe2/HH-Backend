alter table "crowdfunding_platform"."voucher_value" alter column "description" drop not null;
alter table "crowdfunding_platform"."voucher_value" add column "description" text;
