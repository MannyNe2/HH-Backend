CREATE TABLE "crowdfunding_platform"."campaign_reward" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "campaign_id" uuid NOT NULL, "pledge_amount" numeric NOT NULL DEFAULT 10, "title" text NOT NULL, "description" text NOT NULL, "estimated_delivery_date" date NOT NULL, "type" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("campaign_id") REFERENCES "crowdfunding_platform"."campaign"("id") ON UPDATE cascade ON DELETE cascade, CONSTRAINT "minimum_pledge" CHECK (pledge_amount >= 1), CONSTRAINT "delivery_date_in_future" CHECK (estimated_delivery_date > created_at and estimated_delivery_date > now()));
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
CREATE TRIGGER "set_crowdfunding_platform_campaign_reward_updated_at"
BEFORE UPDATE ON "crowdfunding_platform"."campaign_reward"
FOR EACH ROW
EXECUTE PROCEDURE "crowdfunding_platform"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_crowdfunding_platform_campaign_reward_updated_at" ON "crowdfunding_platform"."campaign_reward" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
