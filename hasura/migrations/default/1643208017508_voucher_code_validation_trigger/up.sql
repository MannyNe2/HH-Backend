CREATE FUNCTION normalize_voucher() RETURNS trigger as $normalize_voucher$
    BEGIN
        IF NEW.code IS NULL THEN
            RAISE EXCEPTION 'code cannot be null';
        END IF;
        
        NEW.code := upper(NEW.code);
        RETURN NEW;
    END;
    
$normalize_voucher$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_voucher BEFORE INSERT OR UPDATE ON crowdfunding_platform.voucher
    FOR EACH ROW EXECUTE FUNCTION normalize_voucher();
