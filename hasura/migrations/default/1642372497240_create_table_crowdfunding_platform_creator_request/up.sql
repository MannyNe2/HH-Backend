CREATE TABLE "crowdfunding_platform"."creator_request" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "requested_by_user_id" uuid NOT NULL, "handled_by_user_id" uuid, "status" text NOT NULL DEFAULT 'pending', "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("requested_by_user_id") REFERENCES "crowdfunding_platform"."user"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("handled_by_user_id") REFERENCES "crowdfunding_platform"."user"("id") ON UPDATE cascade ON DELETE set null);
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
CREATE TRIGGER "set_crowdfunding_platform_creator_request_updated_at"
BEFORE UPDATE ON "crowdfunding_platform"."creator_request"
FOR EACH ROW
EXECUTE PROCEDURE "crowdfunding_platform"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_crowdfunding_platform_creator_request_updated_at" ON "crowdfunding_platform"."creator_request" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
