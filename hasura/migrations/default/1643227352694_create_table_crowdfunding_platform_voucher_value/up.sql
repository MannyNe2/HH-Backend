CREATE TABLE "crowdfunding_platform"."voucher_value" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "value" numeric NOT NULL DEFAULT 100, PRIMARY KEY ("id") , UNIQUE ("value"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
