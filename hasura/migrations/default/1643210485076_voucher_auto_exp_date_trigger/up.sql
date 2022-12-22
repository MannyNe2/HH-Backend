CREATE FUNCTION set_voucher_exp_date() RETURNS trigger as $set_voucher_exp_date$
    BEGIN
        IF NEW.exp_date IS NULL THEN
            NEW.exp_date := NEW.created_at + interval '2 years';
        END IF;
        
        RETURN NEW;
    END;
    
$set_voucher_exp_date$ LANGUAGE plpgsql;

CREATE TRIGGER set_voucher_exp_date BEFORE INSERT ON crowdfunding_platform.voucher
    FOR EACH ROW EXECUTE FUNCTION set_voucher_exp_date();
