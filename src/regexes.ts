// Regex building blocks for color patterns

// Common number patterns
export const HEX = '[0-9a-fA-F]';
export const NUMBER = String.raw`\d*\.?\d+`;
export const PERCENTAGE = String.raw`\d*\.?\d+%`;
export const SIGNED_NUMBER = String.raw`-?\d*\.?\d+`;

// Value patterns
export const NONE = 'none';
export const NUMBER_OR_NONE = String.raw`(?:\d*\.?\d+%?|none)`;
export const SIGNED_NUMBER_OR_NONE = String.raw`(?:-?\d*\.?\d+%?|none)`;
// 0-255 (or 0-99.99%, or none) - validates actual byte range
export const BYTE_VALUE = String.raw`(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.\d+)?|\d*\.?\d+%|none)`;

// Angle patterns
export const ANGLE = String.raw`\d*\.?\d+(?:deg|grad|rad|turn)?`;
export const ANGLE_OR_NONE = String.raw`(?:\d*\.?\d+(?:deg|grad|rad|turn)?|none)`;

// Alpha channel
export const ALPHA = String.raw`\d*\.?\d+%?`;
export const ALPHA_SLASH = String.raw`\s*\/\s*(?:\d*\.?\d+%?|none)`;

// Whitespace
export const WS = String.raw`\s*`;
export const WS_REQUIRED = String.raw`\s+`;

// Relative color syntax
export const FROM = String.raw`from\s+.+\s+`;

// Helper to create regex with optional 'from' clause
export const withFrom = (pattern: string) => String.raw`(?:${FROM})?${pattern}`;
