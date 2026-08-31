import { BookingQuote } from '@/types';
import { APP_CONFIG } from '@/lib/constants';

export interface PriceCalculationInput {
  pricePerDay: number;
  pricePerHour?: number;
  securityDeposit: number;
  deliveryAvailable: boolean;
  deliveryCharges?: number;
  deliveryRequested?: boolean;
  withDriver?: boolean;
  driverAllowancePerDay?: number;
  startTime: string | Date;
  endTime: string | Date;
  customCommissionRate?: number;
  customTaxRate?: number;
}

export function calculateServerQuote(input: PriceCalculationInput): BookingQuote {
  const start = new Date(input.startTime).getTime();
  const end = new Date(input.endTime).getTime();

  if (isNaN(start) || isNaN(end) || end <= start) {
    throw new Error("Invalid start or return date/time.");
  }

  const durationHours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
  const durationDays = parseFloat((durationHours / 24).toFixed(1));
  const days = Math.ceil(durationHours / 24);

  // Base rental calculation
  let baseRentalAmount = 0;
  if (durationHours < 24 && input.pricePerHour && input.pricePerHour > 0) {
    baseRentalAmount = Math.round(durationHours * input.pricePerHour);
  } else {
    baseRentalAmount = Math.round(days * input.pricePerDay);
  }

  // Chauffeur / Driver allowance (default ₹500/day)
  let driverAllowanceAmount = 0;
  if (input.withDriver) {
    const dailyRate = input.driverAllowancePerDay ?? 500;
    driverAllowanceAmount = Math.round(days * dailyRate);
  }

  // Delivery fee
  let deliveryAmount = 0;
  if (input.deliveryRequested && input.deliveryAvailable && input.deliveryCharges) {
    deliveryAmount = Number(input.deliveryCharges);
  }

  // Tax (GST 5% on rental fare)
  const taxRate = input.customTaxRate ?? APP_CONFIG.defaultTaxRate;
  const taxesFeesAmount = Math.round((baseRentalAmount * taxRate) / 100);

  // Security deposit
  const securityDepositAmount = Number(input.securityDeposit || 2000);

  // Platform commission
  const commissionRate = input.customCommissionRate ?? APP_CONFIG.defaultCommissionRate;
  const platformCommissionAmount = Math.round((baseRentalAmount * commissionRate) / 100);
  const ownerEarningsAmount = (baseRentalAmount - platformCommissionAmount) + driverAllowanceAmount;

  // Total payable now
  const totalAmount = baseRentalAmount + deliveryAmount + driverAllowanceAmount + taxesFeesAmount + securityDepositAmount;

  return {
    duration_hours: durationHours,
    duration_days: durationDays,
    base_rental_amount: baseRentalAmount,
    delivery_amount: deliveryAmount,
    driver_allowance_amount: driverAllowanceAmount,
    taxes_fees_amount: taxesFeesAmount,
    security_deposit_amount: securityDepositAmount,
    platform_commission_amount: platformCommissionAmount,
    owner_earnings_amount: ownerEarningsAmount,
    total_amount: totalAmount,
    payable_now: totalAmount,
    refundable_deposit: securityDepositAmount,
  };
}
