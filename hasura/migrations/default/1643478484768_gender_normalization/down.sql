-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE FUNCTION normalize_gender() RETURNS trigger as $normalize_gender$
--     BEGIN
--         IF NEW.gender IS NULL THEN
--             RAISE EXCEPTION 'gender cannot be null';
--         END IF;
--
--         NEW.gender := lower(NEW.gender);
--         RETURN NEW;
--     END;
--
-- $normalize_gender$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER normalize_gender BEFORE INSERT OR UPDATE ON crowdfunding_platform.user
--     FOR EACH ROW EXECUTE FUNCTION normalize_gender();
