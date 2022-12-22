CREATE TABLE "crowdfunding_platform"."comment" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "campaign_id" uuid NOT NULL, "text" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "crowdfunding_platform"."user"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("campaign_id") REFERENCES "crowdfunding_platform"."campaign"("id") ON UPDATE cascade ON DELETE cascade);
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
CREATE TRIGGER "set_crowdfunding_platform_comment_updated_at"
BEFORE UPDATE ON "crowdfunding_platform"."comment"
FOR EACH ROW
EXECUTE PROCEDURE "crowdfunding_platform"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_crowdfunding_platform_comment_updated_at" ON "crowdfunding_platform"."comment" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
