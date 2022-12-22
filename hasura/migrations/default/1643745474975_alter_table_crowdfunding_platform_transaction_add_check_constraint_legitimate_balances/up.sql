alter table "crowdfunding_platform"."transaction" add constraint "legitimate_balances" check (starting_balance + amount = final_balance);
