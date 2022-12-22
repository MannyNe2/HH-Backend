alter table "crowdfunding_platform"."campaign_report" add column "updated_at" timestamptz
 null default now();

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
CREATE TRIGGER "set_crowdfunding_platform_campaign_report_updated_at"
BEFORE UPDATE ON "crowdfunding_platform"."campaign_report"
FOR EACH ROW
EXECUTE PROCEDURE "crowdfunding_platform"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_crowdfunding_platform_campaign_report_updated_at" ON "crowdfunding_platform"."campaign_report" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
