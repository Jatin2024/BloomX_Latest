const COUNTRY_OPTIONS = [
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', pattern: /^\d{10}$/ },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', pattern: /^\d{10}$/ },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', pattern: /^(\+44\s?7\d{3}|07\d{3})\s?\d{6}$/ },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353', pattern: /^\d{7,9}$/ },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', pattern: /^\d{9}$/ },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64', pattern: /^\d{8,9}$/ },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', pattern: /^\d{10}$/ },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', pattern: /^\d{8}$/ },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', pattern: /^\d{8,9}$/ },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', pattern: /^\d{9}$/ },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', pattern: /^\d{10,11}$/ },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', pattern: /^\d{9}$/ },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', pattern: /^\d{8,9}$/ },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32', pattern: /^\d{8,9}$/ },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', pattern: /^\d{9}$/ },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', pattern: /^\d{9,10}$/ },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46', pattern: /^\d{9}$/ },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47', pattern: /^\d{8}$/ },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45', pattern: /^\d{8}$/ },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358', pattern: /^\d{9,10}$/ },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48', pattern: /^\d{9}$/ },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420', pattern: /^\d{9}$/ },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', pattern: /^\d{9}$/ },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43', pattern: /^\d{10}$/ },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', pattern: /^\d{9}$/ },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30', pattern: /^\d{10}$/ },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972', pattern: /^\d{9}$/ },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', pattern: /^\d{9,10}$/ },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82', pattern: /^\d{9,10}$/ },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86', pattern: /^\d{11}$/ },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852', pattern: /^\d{8}$/ },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '+886', pattern: /^\d{9}$/ },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', pattern: /^\d{9,10}$/ },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62', pattern: /^\d{9,11}$/ },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', pattern: /^\d{10}$/ },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66', pattern: /^\d{9}$/ },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84', pattern: /^\d{9,10}$/ },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', pattern: /^\d{10,11}$/ },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52', pattern: /^\d{10}$/ },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54', pattern: /^\d{10}$/ },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56', pattern: /^\d{9}$/ },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57', pattern: /^\d{10}$/ },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51', pattern: /^\d{9}$/ },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '+598', pattern: /^\d{8,9}$/ }
];

export function getCountryOptions() {
  return COUNTRY_OPTIONS;
}

export function getCountryByCode(code) {
  return COUNTRY_OPTIONS.find((country) => country.code === code) || COUNTRY_OPTIONS[0];
}

export function validatePhoneNumber(value, countryCode) {
  const normalized = String(value || '').replace(/\s+/g, '').trim();
  if (!normalized) {
    return 'Phone number is required.';
  }

  if (!/^\d+$/.test(normalized)) {
    return 'Phone number must contain only digits.';
  }

  const country = getCountryByCode(countryCode);
  if (!country) {
    return 'Please select a country.';
  }

  const cleanValue = normalized.startsWith(country.dialCode.replace('+', ''))
    ? normalized.slice(country.dialCode.replace('+', '').length)
    : normalized;

  if (!country.pattern.test(cleanValue)) {
    return `Phone number is invalid for ${country.code}.`;
  }

  return '';
}
