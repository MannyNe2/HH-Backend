CREATE FUNCTION normalize_pledge() RETURNS trigger as $normalize_pledge$
    BEGIN
        IF NEW.amount IS NOT NULL THEN
            NEW.amount := ABS(NEW.amount);
        END IF;
        
        RETURN NEW;
    END;
    
$normalize_pledge$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_pledge BEFORE INSERT ON crowdfunding_platform.pledge
    FOR EACH ROW EXECUTE FUNCTION normalize_pledge();
