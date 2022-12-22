alter table "crowdfunding_platform"."withdrawal_request" rename column "status" to "is_approved";
alter table "crowdfunding_platform"."withdrawal_request" alter column "is_approved" set default 'false';
ALTER TABLE "crowdfunding_platform"."withdrawal_request" ALTER COLUMN "is_approved" TYPE boolean;
