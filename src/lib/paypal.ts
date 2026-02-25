// Auto-switch PayPal links based on early bird deadline
const EARLY_BIRD_DEADLINE = new Date(process.env.NEXT_PUBLIC_CONGRESS_EARLYBIRD_DEADLINE || '2026-05-15');

export function isEarlyBird(): boolean {
  return new Date() < EARLY_BIRD_DEADLINE;
}

export const PAYPAL_LINKS = {
  wahs: {
    professional: process.env.NEXT_PUBLIC_PAYPAL_WAHS_PROFESSIONAL!,
    student: process.env.NEXT_PUBLIC_PAYPAL_WAHS_STUDENT!,
  },
  congress2026: {
    regular: () => isEarlyBird()
      ? process.env.NEXT_PUBLIC_PAYPAL_CONGRESS_REGULAR_EARLYBIRD!
      : process.env.NEXT_PUBLIC_PAYPAL_CONGRESS_REGULAR_FULLPRICE!,
    student: () => isEarlyBird()
      ? process.env.NEXT_PUBLIC_PAYPAL_CONGRESS_STUDENT_EARLYBIRD!
      : process.env.NEXT_PUBLIC_PAYPAL_CONGRESS_STUDENT_FULLPRICE!,
    wahsMember: null as null, // Free — no PayPal link
  },
};

export function getCongressPrice(tier: 'regular' | 'student', earlyBird?: boolean): string {
  const eb = earlyBird ?? isEarlyBird();
  if (tier === 'regular') return eb ? '$240' : '$300';
  return eb ? '$120' : '$150';
}
