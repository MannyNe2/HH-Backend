alter table "crowdfunding_platform"."campaign_report" add constraint "campaign_report_reported_campaign_id_reporting_user_id_key" unique ("reported_campaign_id", "reporting_user_id");
