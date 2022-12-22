alter table "crowdfunding_platform"."campaign_reward" add constraint "campaign_reward_campaign_id_pledge_amount_type_key" unique ("campaign_id", "pledge_amount", "type");
