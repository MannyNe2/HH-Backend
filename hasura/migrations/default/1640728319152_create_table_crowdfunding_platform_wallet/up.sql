CREATE TABLE "crowdfunding_platform"."wallet" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "pledged_balance" numeric NOT NULL DEFAULT 0, "useable_balance" numeric NOT NULL DEFAULT 0, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("id") REFERENCES "crowdfunding_platform"."user"("wallet_id") ON UPDATE cascade ON DELETE cascade);
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
CREATE TRIGGER "set_crowdfunding_platform_wallet_updated_at"
BEFORE UPDATE ON "crowdfunding_platform"."wallet"
FOR EACH ROW
EXECUTE PROCEDURE "crowdfunding_platform"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_crowdfunding_platform_wallet_updated_at" ON "crowdfunding_platform"."wallet" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
