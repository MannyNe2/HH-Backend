CREATE FUNCTION normalize_email() RETURNS trigger as $normalize_email$
    BEGIN
        IF NEW.email_address IS NULL THEN
            RAISE EXCEPTION 'email_address cannot be null';
        END IF;
        
        NEW.email_address := lower(NEW.email_address);
        RETURN NEW;
    END;
    
$normalize_email$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_email BEFORE INSERT OR UPDATE ON crowdfunding_platform.user
    FOR EACH ROW EXECUTE FUNCTION normalize_email();
