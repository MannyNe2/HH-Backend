alter table "crowdfunding_platform"."saved_campaign"
    add constraint "saved_projects_pkey"
    primary key ("campaign_id", "user_id");
