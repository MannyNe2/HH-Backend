alter table "crowdfunding_platform"."user_eligible_rewards" add constraint "user_eligible_rewards_user_id_reward_id_key" unique ("user_id", "reward_id");
