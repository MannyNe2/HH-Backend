CREATE TABLE "crowdfunding_platform"."donation" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "wallet_id" uuid NOT NULL, "project_id" uuid NOT NULL, "amount" numeric NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("wallet_id") REFERENCES "crowdfunding_platform"."wallet"("id") ON UPDATE cascade ON DELETE no action, FOREIGN KEY ("project_id") REFERENCES "crowdfunding_platform"."transaction"("id") ON UPDATE cascade ON DELETE no action);
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
CREATE TRIGGER "set_crowdfunding_platform_donation_updated_at"
BEFORE UPDATE ON "crowdfunding_platform"."donation"
FOR EACH ROW
EXECUTE PROCEDURE "crowdfunding_platform"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_crowdfunding_platform_donation_updated_at" ON "crowdfunding_platform"."donation" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
