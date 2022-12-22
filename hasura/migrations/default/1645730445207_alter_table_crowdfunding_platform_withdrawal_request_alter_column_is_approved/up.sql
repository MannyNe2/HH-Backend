ALTER TABLE "crowdfunding_platform"."withdrawal_request" ALTER COLUMN "is_approved" TYPE text;
alter table "crowdfunding_platform"."withdrawal_request" alter column "is_approved" set default 'pending';
alter table "crowdfunding_platform"."withdrawal_request" rename column "is_approved" to "status";
