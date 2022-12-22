-- Creator requests
insert into crowdfunding_platform.creator_request (id, requested_by_user_id, identification_image, "status", handled_by_user_id) values ('10ae624c-49d3-4435-8d6a-0b3e2f31754e', '4d0fc644-c097-4fac-a93e-2be5d6724ab1', 'https://i.imgur.com/NXc3rJS.jpg', 'pending', null);
insert into crowdfunding_platform.creator_request (id, requested_by_user_id, identification_image, "status", handled_by_user_id) values ('3c2e1624-dc24-4ffe-9812-3e71f600d1be', '43873aa6-4545-48d5-aafa-efedcbc7f428', 'https://i.imgur.com/NXc3rJS.jpg', 'denied', '39e90155-5027-454b-8e38-7195f5600585');
insert into crowdfunding_platform.creator_request (id, requested_by_user_id, identification_image, "status", handled_by_user_id) values ('d3818445-8178-4995-9720-14a17c371797', '472117e7-ae17-4559-99e8-83c9cfa09bbd', 'https://i.imgur.com/NXc3rJS.jpg', 'pending', null);
insert into crowdfunding_platform.creator_request (id, requested_by_user_id, identification_image, "status", handled_by_user_id) values ('8cd59809-c94d-4d7b-a0a2-8dc81ad5dc1b', '0e997b45-1f41-4963-ac34-81467a08ae58', 'https://i.imgur.com/NXc3rJS.jpg', 'pending', null);
insert into crowdfunding_platform.creator_request (id, requested_by_user_id, identification_image, "status", handled_by_user_id) values ('420cee6b-fc87-4a53-916b-d968bcedb714', '5f2d83e5-1587-41e7-b290-0c8dbc75941b', 'https://i.imgur.com/NXc3rJS.jpg', 'approved', '01309725-4957-4d8f-ba73-4ab8c847c590');
insert into crowdfunding_platform.creator_request (id, requested_by_user_id, identification_image, "status", handled_by_user_id) values ('0a35bb7a-431f-47d4-8208-b2b729d2ecb9', 'cd51897a-21ba-4dba-9477-1d0db4803d68', 'https://i.imgur.com/NXc3rJS.jpg', 'approved', '01309725-4957-4d8f-ba73-4ab8c847c590');
insert into crowdfunding_platform.creator_request (id, requested_by_user_id, identification_image, "status", handled_by_user_id) values ('84901165-37c3-4215-aff6-b0cf0721b80b', 'bcf24317-d73f-404f-add1-1e536cdb3cd2', 'https://i.imgur.com/NXc3rJS.jpg', 'pending', null);

-- Set verified creators
update crowdfunding_platform.user
set "is_verified"='true'
where id in (
  '5f2d83e5-1587-41e7-b290-0c8dbc75941b',
  'cd51897a-21ba-4dba-9477-1d0db4803d68'
);

-- Set creator roles
update crowdfunding_platform.user
set "role"='creator'
where id in (
  '5f2d83e5-1587-41e7-b290-0c8dbc75941b',
  'cd51897a-21ba-4dba-9477-1d0db4803d68'
);