/**
 * Web Crypto SHA-256 Authentication & Hashing Utilities
 * Ensures zero plaintext passwords ever touch localStorage or persistent storage.
 */

export function generateSalt(): string {
  const saltBytes = new Uint8Array(16);
  window.crypto.getRandomValues(saltBytes);
  return Array.from(saltBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface PasswordCheck {
  label: string;
  passed: boolean;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  level: 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  checks: PasswordCheck[];
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const checks: PasswordCheck[] = [
    { label: 'At least 8 characters', passed: password.length >= 8 },
    { label: 'Contains uppercase letter', passed: /[A-Z]/.test(password) },
    { label: 'Contains number or symbol', passed: /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
    { label: 'No easy sequences', passed: !/(1234|abcd|password|qwerty)/i.test(password) && password.length > 0 },
  ];

  const passedCount = checks.filter(c => c.passed).length;

  let level: 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
  let color = '#C2410C'; // Terracotta

  if (passedCount === 4 && password.length >= 10) {
    level = 'Strong';
    color = '#2D5A27'; // Olive
  } else if (passedCount >= 3) {
    level = 'Good';
    color = '#166534';
  } else if (passedCount >= 2) {
    level = 'Fair';
    color = '#D97706'; // Turmeric
  }

  return {
    score: passedCount,
    level,
    color,
    checks,
  };
}
