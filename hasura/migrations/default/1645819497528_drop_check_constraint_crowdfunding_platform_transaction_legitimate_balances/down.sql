alter table "crowdfunding_platform"."transaction" add constraint "legitimate_balances" check (CHECK ((starting_balance + amount) = final_balance));
