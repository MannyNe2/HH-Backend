CREATE TABLE "crowdfunding_platform"."withdrawal_request" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "requested_from" uuid NOT NULL, "handled_by" uuid, "is_approved" boolean NOT NULL DEFAULT false, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("requested_from") REFERENCES "crowdfunding_platform"."project"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("handled_by") REFERENCES "crowdfunding_platform"."user"("id") ON UPDATE cascade ON DELETE no action, UNIQUE ("requested_from"));
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
CREATE TRIGGER "set_crowdfunding_platform_withdrawal_request_updated_at"
BEFORE UPDATE ON "crowdfunding_platform"."withdrawal_request"
FOR EACH ROW
EXECUTE PROCEDURE "crowdfunding_platform"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_crowdfunding_platform_withdrawal_request_updated_at" ON "crowdfunding_platform"."withdrawal_request" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
