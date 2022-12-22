CREATE TABLE "crowdfunding_platform"."campaign_likes" ("user_id" uuid NOT NULL, "campaign_id" UUID NOT NULL, PRIMARY KEY ("user_id","campaign_id") , FOREIGN KEY ("user_id") REFERENCES "crowdfunding_platform"."user"("id") ON UPDATE cascade ON DELETE set null, FOREIGN KEY ("campaign_id") REFERENCES "crowdfunding_platform"."campaign"("id") ON UPDATE cascade ON DELETE cascade);
