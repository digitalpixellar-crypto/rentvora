ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles can be read by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view approved cars" ON public.cars FOR SELECT TO anon, authenticated USING (approval_status = 'approved' OR owner_id = auth.uid());
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT TO authenticated USING (customer_id = auth.uid() OR owner_id = auth.uid());
