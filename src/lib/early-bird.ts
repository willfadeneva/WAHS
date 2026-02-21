// Early bird deadline: May 15, 2026 23:59:59 KST (UTC+9)
const EARLY_BIRD_DEADLINE = new Date('2026-05-15T23:59:59+09:00');

// Registration prices (in USD)
const PRICES = {
  EARLY_BIRD: {
    REGULAR: 240,    // $300 - 20%
    STUDENT: 120,    // $150 - 20%
    WAHS_MEMBER: 0   // Free
  },
  REGULAR: {
    REGULAR: 300,
    STUDENT: 150,
    WAHS_MEMBER: 0
  }
};

/**
 * Check if early bird pricing is still available
 */
export function isEarlyBirdAvailable(): boolean {
  const now = new Date();
  return now < EARLY_BIRD_DEADLINE;
}

/**
 * Get current price based on registration type and date
 */
export function getCurrentPrice(
  registrationType: 'REGULAR' | 'STUDENT' | 'WAHS_MEMBER'
): number {
  const isEarlyBird = isEarlyBirdAvailable();
  const priceSet = isEarlyBird ? PRICES.EARLY_BIRD : PRICES.REGULAR;
  return priceSet[registrationType];
}

/**
 * Get price display string
 */
export function getPriceDisplay(
  registrationType: 'REGULAR' | 'STUDENT' | 'WAHS_MEMBER'
): string {
  const price = getCurrentPrice(registrationType);
  const isEarlyBird = isEarlyBirdAvailable();
  
  if (price === 0) return 'Free';
  
  const regularPrice = PRICES.REGULAR[registrationType];
  const earlyBirdPrice = PRICES.EARLY_BIRD[registrationType];
  
  if (isEarlyBird) {
    const discount = regularPrice - earlyBirdPrice;
    const discountPercent = Math.round((discount / regularPrice) * 100);
    return `$${earlyBirdPrice} <span style="text-decoration: line-through; color: #666; margin-left: 8px;">$${regularPrice}</span> <span style="color: #CD2E3A; margin-left: 8px;">(${discountPercent}% off)</span>`;
  }
  
  return `$${price}`;
}

/**
 * Get time remaining until early bird deadline
 */
export function getTimeRemaining(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isActive: boolean;
} {
  const now = new Date();
  const diff = EARLY_BIRD_DEADLINE.getTime() - now.getTime();
  
  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isActive: false
    };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return {
    days,
    hours,
    minutes,
    seconds,
    isActive: true
  };
}

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(): string {
  const { days, hours, minutes, seconds, isActive } = getTimeRemaining();
  
  if (!isActive) {
    return 'Early bird deadline has passed';
  }
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''} remaining`;
  }
  
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''}, ${seconds} second${seconds !== 1 ? 's' : ''} remaining`;
}

/**
 * Check if a registration qualifies for early bird price
 * based on submission/registration date
 */
export function qualifiesForEarlyBird(registrationDate: Date | string): boolean {
  const date = typeof registrationDate === 'string' 
    ? new Date(registrationDate) 
    : registrationDate;
  
  return date < EARLY_BIRD_DEADLINE;
}

/**
 * Get HTML for early bird countdown display
 */
export function getEarlyBirdDisplayHtml(): string {
  const isActive = isEarlyBirdAvailable();
  const timeRemaining = getTimeRemaining();
  
  if (!isActive) {
    return `
      <div style="
        background: linear-gradient(135deg, #CD2E3A 0%, #0047A0 100%);
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        margin: 20px 0;
      ">
        <h3 style="margin: 0 0 10px 0; font-size: 1.2rem;">
          Early Bird Registration Closed
        </h3>
        <p style="margin: 0; opacity: 0.9;">
          Regular pricing now applies
        </p>
      </div>
    `;
  }
  
  return `
    <div style="
      background: linear-gradient(135deg, #0047A0 0%, #CD2E3A 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    ">
      <h3 style="margin: 0 0 15px 0; font-size: 1.2rem;">
        🎯 Early Bird Registration Ends Soon!
      </h3>
      
      <div style="
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 15px;
      ">
        <div style="text-align: center;">
          <div style="font-size: 1.8rem; font-weight: bold;">
            ${timeRemaining.days.toString().padStart(2, '0')}
          </div>
          <div style="font-size: 0.8rem; opacity: 0.9;">Days</div>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 1.8rem; font-weight: bold;">
            ${timeRemaining.hours.toString().padStart(2, '0')}
          </div>
          <div style="font-size: 0.8rem; opacity: 0.9;">Hours</div>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 1.8rem; font-weight: bold;">
            ${timeRemaining.minutes.toString().padStart(2, '0')}
          </div>
          <div style="font-size: 0.8rem; opacity: 0.9;">Minutes</div>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 1.8rem; font-weight: bold;">
            ${timeRemaining.seconds.toString().padStart(2, '0')}
          </div>
          <div style="font-size: 0.8rem; opacity: 0.9;">Seconds</div>
        </div>
      </div>
      
      <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">
        Save 20% on registration fees
      </p>
      <p style="margin: 5px 0 0 0; font-size: 0.8rem; opacity: 0.8;">
        Deadline: May 15, 2026 23:59:59 KST
      </p>
    </div>
  `;
}