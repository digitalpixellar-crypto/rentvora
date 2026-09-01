export const APP_CONFIG = {
  name: "RENTVORA",
  tagline: "Self-Drive Car Rentals in Proddatur & Andhra Pradesh",
  defaultCity: "Proddatur",
  defaultState: "Andhra Pradesh",
  supportPhone: "+91 78938 17322",
  supportEmail: "support@rentvora.in",
  adminEmail: "admin@rentvora.in",
  defaultCommissionRate: 10.0, // 10%
  defaultTaxRate: 5.0, // 5% GST
  minRentalHours: 12,
  maxRentalDays: 30,
  cancellationFreeWindowHours: 24,
  cancellationFeeRate: 20.0, // 20% penalty if cancelled within 24h
};

export const PRODDATUR_LOCATIONS = [
  { id: "loc-prd-1", city: "Proddatur", state: "Andhra Pradesh", area_locality: "Korrapadu Road", landmark: "Near RTC Bus Stand", pickup_point_name: "Proddatur RTC Bus Stand Hub", is_active: true },
  { id: "loc-prd-2", city: "Proddatur", state: "Andhra Pradesh", area_locality: "Gandhi Road", landmark: "Opposite Clock Tower", pickup_point_name: "Gandhi Road Center", is_active: true },
  { id: "loc-prd-3", city: "Proddatur", state: "Andhra Pradesh", area_locality: "Mydukur Road", landmark: "Near Reliance Smart Bazaar", pickup_point_name: "Mydukur Road Station", is_active: true },
  { id: "loc-prd-4", city: "Proddatur", state: "Andhra Pradesh", area_locality: "Holmespet", landmark: "Near Sri Vasavi Kanyaka Parameswari Temple", pickup_point_name: "Holmespet Main Point", is_active: true },
  { id: "loc-prd-5", city: "Proddatur", state: "Andhra Pradesh", area_locality: "Bollavaram", landmark: "Near YMR Colony Arch", pickup_point_name: "Bollavaram Hub", is_active: true },
  { id: "loc-prd-6", city: "Proddatur", state: "Andhra Pradesh", area_locality: "Sivarampuram", landmark: "Bypass Junction", pickup_point_name: "Bypass Point", is_active: true },
  // Kadapa Expansion Points
  { id: "loc-kdp-1", city: "Kadapa", state: "Andhra Pradesh", area_locality: "RTC Complex", landmark: "Main Kadapa Bus Stand", pickup_point_name: "Kadapa Central Hub", is_active: true },
  { id: "loc-kdp-2", city: "Kadapa", state: "Andhra Pradesh", area_locality: "Railway Station", landmark: "Platform 1 Exit", pickup_point_name: "Kadapa Railway Station", is_active: true },
];

export const CAR_BRANDS = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata Motors",
  "Mahindra",
  "Toyota",
  "Kia",
  "Honda",
  "Volkswagen"
];

export const POPULAR_FEATURES = [
  "Automatic Transmission",
  "Touchscreen Infotainment",
  "Apple CarPlay & Android Auto",
  "Reverse Camera & Sensors",
  "Air Conditioning & Climate Control",
  "Airbags (Driver & Passenger)",
  "GPS Navigation",
  "Bluetooth & USB Fast Charging",
  "Power Windows & Steering",
  "Sunroof",
  "Cruise Control",
  "ABS with EBD"
];
