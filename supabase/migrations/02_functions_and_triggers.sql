CREATE SEQUENCE IF NOT EXISTS booking_reference_seq START 1;

CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
    current_year TEXT;
    seq_val TEXT;
BEGIN
    current_year := TO_CHAR(NOW() AT TIME ZONE 'Asia/Kolkata', 'YYYY');
    seq_val := LPAD(NEXTVAL('booking_reference_seq')::TEXT, 6, '0');
    RETURN 'PRD-' || current_year || '-' || seq_val;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_car_availability(
    p_car_id UUID,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    overlap_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO overlap_count
    FROM public.bookings
    WHERE car_id = p_car_id
      AND status IN ('confirmed', 'active', 'payment_processing', 'owner_confirmation_required')
      AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
      AND (
          (start_time <= p_start_time AND end_time > p_start_time) OR
          (start_time < p_end_time AND end_time >= p_end_time) OR
          (start_time >= p_start_time AND end_time <= p_end_time)
      );

    RETURN (overlap_count = 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
