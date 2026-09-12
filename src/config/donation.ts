/**
 * Donation & Support Configuration
 * 
 * Paste your actual Razorpay Payment Link below, or set VITE_RAZORPAY_PAYMENT_LINK in your .env file.
 * 
 * Example formats:
 *   'https://rzp.io/l/your-link'
 *   'https://rzp.io/i/your-link'
 * 
 * SECURITY NOTICE:
 * - Never place Razorpay Secret Keys or private API credentials in frontend code.
 * - Razorpay Payment Links are public URLs generated directly in your Razorpay Dashboard.
 */
export const RAZORPAY_PAYMENT_LINK: string =
  (import.meta.env.VITE_RAZORPAY_PAYMENT_LINK as string | undefined)?.trim() ||
  'https://razorpay.me/@greenjournal';
