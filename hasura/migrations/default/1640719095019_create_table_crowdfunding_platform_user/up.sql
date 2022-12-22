CREATE TABLE "crowdfunding_platform"."user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "display_name" text NOT NULL, "first_name" text NOT NULL, "last_name" text NOT NULL, "email_address" text NOT NULL, "password" text NOT NULL, "phone_number" numeric, "avatar" text NOT NULL, "role" text NOT NULL DEFAULT 'user', "about" text, "wallet_id" uuid, "is_verified" boolean NOT NULL DEFAULT false, "is_enabled" boolean NOT NULL DEFAULT false, "is_banned" boolean NOT NULL DEFAULT false, "is_muted" boolean NOT NULL DEFAULT false, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("display_name"), UNIQUE ("email_address"), UNIQUE ("phone_number"), UNIQUE ("wallet_id"));
CREATE OR REPLACE FUNCTION "crowdfunding_platform"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_crowdfunding_platform_user_updated_at"
BEFORE UPDATE ON "crowdfunding_platform"."user"
FOR EACH ROW
EXECUTE PROCEDURE "crowdfunding_platform"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_crowdfunding_platform_user_updated_at" ON "crowdfunding_platform"."user" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
