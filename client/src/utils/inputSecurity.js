const suspiciousPattern = /<\s*script|javascript:|on\w+\s*=|<\s*iframe|<\s*object|<\s*embed|data:text\/html|vbscript:/i;

export function hasSuspiciousInput(value) {
  return suspiciousPattern.test(String(value || ''));
}

export function sanitizeInput(value, maxLength = 2000) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}
