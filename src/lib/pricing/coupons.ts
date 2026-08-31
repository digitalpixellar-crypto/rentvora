export interface Coupon {
  code: string;
  type: 'flat' | 'percentage';
  value: number; // e.g. 300 for flat 300, 10 for 10%
  description: string;
  minBookingDays?: number;
  maxDiscount?: number;
  isActive: boolean;
}

export const ACTIVE_PROMO_CODES: Coupon[] = [
  {
    code: 'FIRSTDRIVE',
    type: 'flat',
    value: 300,
    description: 'Flat ₹300 off on your first self-drive booking in AP',
    isActive: true,
  },
  {
    code: 'PRODDATUR10',
    type: 'percentage',
    value: 10,
    maxDiscount: 1000,
    description: '10% instant discount across all Proddatur & Kadapa cars',
    isActive: true,
  },
  {
    code: 'WEEKEND500',
    type: 'flat',
    value: 500,
    minBookingDays: 2,
    description: '₹500 off on weekend road trips (minimum 2 days)',
    isActive: true,
  },
  {
    code: 'FESTIVE20',
    type: 'percentage',
    value: 20,
    maxDiscount: 1500,
    description: '20% festive discount on premium SUVs and 7-seaters',
    isActive: true,
  },
];

export interface CouponValidationResult {
  isValid: boolean;
  discountAmount: number;
  code: string;
  description: string;
  error?: string;
}

export function validateAndApplyCoupon(
  inputCode: string,
  baseRentalAmount: number,
  durationDays: number
): CouponValidationResult {
  const cleanCode = inputCode.trim().toUpperCase();
  const coupon = ACTIVE_PROMO_CODES.find((c) => c.code === cleanCode && c.isActive);

  if (!coupon) {
    return {
      isValid: false,
      discountAmount: 0,
      code: cleanCode,
      description: '',
      error: 'Invalid or expired coupon code. Try FIRSTDRIVE or PRODDATUR10.',
    };
  }

  if (coupon.minBookingDays && durationDays < coupon.minBookingDays) {
    return {
      isValid: false,
      discountAmount: 0,
      code: cleanCode,
      description: coupon.description,
      error: `This coupon requires a minimum booking duration of ${coupon.minBookingDays} days.`,
    };
  }

  let discount = 0;
  if (coupon.type === 'flat') {
    discount = Math.min(coupon.value, baseRentalAmount);
  } else if (coupon.type === 'percentage') {
    discount = Math.round((baseRentalAmount * coupon.value) / 100);
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  }

  return {
    isValid: true,
    discountAmount: discount,
    code: coupon.code,
    description: coupon.description,
  };
}
