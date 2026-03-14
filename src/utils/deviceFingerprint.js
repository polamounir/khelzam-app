// src/utils/deviceFingerprint.js

/**
 * Generates a simple deterministic fingerprint hash based on browser metadata.
 * Not cryptographically secure — used for basic device identification.
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

export function generateFingerprint() {
  const components = [
    navigator.userAgent,
    `${screen.width}x${screen.height}`,
    String(screen.colorDepth),
    navigator.language || navigator.userLanguage || 'unknown',
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    String(navigator.hardwareConcurrency || 'unknown'),
    String(navigator.deviceMemory || 'unknown'),
    navigator.platform || 'unknown',
  ];

  const raw = components.join('|');
  const hash = simpleHash(raw);
  return `FP-${hash}`;
}

/**
 * Extracts a short display version of the fingerprint
 */
export function shortFingerprint(fp) {
  return fp ? fp.slice(-8) : '????????';
}
