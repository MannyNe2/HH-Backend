alter table "crowdfunding_platform"."saved_campaign"
    add constraint "saved_campaign_pkey"
    primary key ("user_id", "campaign_id");
