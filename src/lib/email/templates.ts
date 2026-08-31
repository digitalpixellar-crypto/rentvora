export function renderBookingConfirmationEmail(params: {
  customerName: string;
  bookingRef: string;
  carName: string;
  regNumber: string;
  pickupLocation: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  securityDeposit: number;
}) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
      <div style="background: #16a34a; padding: 24px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">RENTVORA</h1>
        <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Booking Confirmed — Self-Drive Rental</p>
      </div>
      
      <div style="padding: 28px;">
        <p style="font-size: 16px; color: #334155;">Hello <strong>${params.customerName}</strong>,</p>
        <p style="color: #475569; font-size: 14px;">Your booking has been successfully confirmed. Please find your reservation details below:</p>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 18px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Booking Reference:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #0f172a;">${params.bookingRef}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Vehicle:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #0f172a;">${params.carName} (${params.regNumber})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Pickup Point:</td>
              <td style="padding: 6px 0; text-align: right; color: #0f172a;">${params.pickupLocation}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Pickup Time:</td>
              <td style="padding: 6px 0; text-align: right; color: #0f172a;">${params.startTime}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Return Time:</td>
              <td style="padding: 6px 0; text-align: right; color: #0f172a;">${params.endTime}</td>
            </tr>
            <tr style="border-top: 1px dashed #cbd5e1;">
              <td style="padding: 10px 0 4px; color: #0f172a; font-weight: bold;">Total Paid:</td>
              <td style="padding: 10px 0 4px; text-align: right; font-size: 16px; font-weight: bold; color: #16a34a;">₹${params.totalAmount.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #64748b; font-size: 12px;">(Includes Refundable Deposit):</td>
              <td style="padding: 2px 0; text-align: right; font-size: 12px; color: #64748b;">₹${params.securityDeposit.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px; margin-bottom: 24px; font-size: 13px; color: #1e40af;">
          <strong>Important Instructions:</strong>
          <ul style="margin: 6px 0 0 16px; padding: 0;">
            <li>Carry your Original Driving License and Aadhaar card.</li>
            <li>Take a video of vehicle body and fuel gauge before driving away.</li>
            <li>Security deposit will be credited back within 24h after vehicle inspection.</li>
          </ul>
        </div>

        <p style="font-size: 13px; color: #94a3b8; text-align: center;">Need assistance? Call RENTVORA local support at +91 98765 43210.</p>
      </div>
    </div>
  `;
}
