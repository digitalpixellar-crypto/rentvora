INSERT INTO public.locations (city, state, area_locality, landmark, pickup_point_name, is_active)
VALUES
('Proddatur', 'Andhra Pradesh', 'Korrapadu Road', 'Near RTC Bus Stand', 'Proddatur RTC Bus Stand Hub', true),
('Proddatur', 'Andhra Pradesh', 'Gandhi Road', 'Opposite Clock Tower', 'Gandhi Road Center', true),
('Proddatur', 'Andhra Pradesh', 'Mydukur Road', 'Near Reliance Smart Bazaar', 'Mydukur Road Station', true),
('Proddatur', 'Andhra Pradesh', 'Holmespet', 'Near Sri Vasavi Kanyaka Parameswari Temple', 'Holmespet Main Point', true),
('Proddatur', 'Andhra Pradesh', 'Bollavaram', 'Near YMR Colony Arch', 'Bollavaram Hub', true),
('Kadapa', 'Andhra Pradesh', 'RTC Complex', 'Main Kadapa Bus Stand', 'Kadapa Central Hub', true)
ON CONFLICT DO NOTHING;
