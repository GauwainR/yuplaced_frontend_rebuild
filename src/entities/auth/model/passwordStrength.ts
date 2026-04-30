export type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password.length) return 'empty';
  if (password.length < 6) return 'weak';
  if (password.length < 10) return 'medium';
  return 'strong';
}

export function getPasswordStrengthLabel(strength: PasswordStrength): string {
  return {
    empty: '',
    weak: 'WEAK',
    medium: 'FAIR',
    strong: 'STRONG',
  }[strength];
}

export function getPasswordStrengthColor(strength: PasswordStrength): string {
  return {
    empty: '#555',
    weak: '#f44336',
    medium: '#ff9800',
    strong: '#4caf50',
  }[strength];
}

export function getStrengthBarClass(strength: PasswordStrength, index: number): string {
  if (strength === 'empty') return 'strength-bar';
  if (strength === 'weak') return index === 0 ? 'strength-bar weak' : 'strength-bar';
  if (strength === 'medium') return index <= 1 ? 'strength-bar medium' : 'strength-bar';
  return 'strength-bar strong';
}
