alter table "crowdfunding_platform"."pledge" add constraint "pledge_wallet_id_campaign_id_key" unique ("wallet_id", "campaign_id");
