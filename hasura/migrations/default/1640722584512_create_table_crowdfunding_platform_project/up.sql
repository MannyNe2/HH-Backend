CREATE TABLE "crowdfunding_platform"."project" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" text NOT NULL, "goal" numeric NOT NULL, "description" text NOT NULL, "banner" text NOT NULL, "thumbnail" text NOT NULL, "is_enabled" boolean NOT NULL DEFAULT false, "is_private" Boolean NOT NULL DEFAULT true, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_crowdfunding_platform_project_updated_at"
BEFORE UPDATE ON "crowdfunding_platform"."project"
FOR EACH ROW
EXECUTE PROCEDURE "crowdfunding_platform"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_crowdfunding_platform_project_updated_at" ON "crowdfunding_platform"."project" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
