CREATE TABLE "crowdfunding_platform"."voucher" ("id" uuid NOT NULL, "code" text NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "exp_date" date NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("code"));
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
CREATE TRIGGER "set_crowdfunding_platform_voucher_updated_at"
BEFORE UPDATE ON "crowdfunding_platform"."voucher"
FOR EACH ROW
EXECUTE PROCEDURE "crowdfunding_platform"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_crowdfunding_platform_voucher_updated_at" ON "crowdfunding_platform"."voucher" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
