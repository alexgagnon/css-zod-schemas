import { z } from 'zod/mini';
import {
  HEX,
  BYTE_VALUE,
  NUMBER_OR_NONE,
  SIGNED_NUMBER_OR_NONE,
  ANGLE,
  ANGLE_OR_NONE,
  ALPHA,
  ALPHA_SLASH,
  WS,
  WS_REQUIRED,
  PERCENTAGE,
  withFrom,
} from './common/regexes.js';

// ============================================================================
// CSS Color Schema
// Based on: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#formal_syntax
// <color> = <color-base> | currentColor | <system-color> | <contrast-color()> | <device-cmyk()> | <light-dark()>
// ============================================================================

// Named colors (CSS Color Level 4)
const namedColors = [
  // Basic colors
  'black', 'silver', 'gray', 'white', 'maroon', 'red', 'purple', 'fuchsia',
  'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'teal', 'aqua',
  // Extended colors
  'aliceblue', 'antiquewhite', 'aquamarine', 'azure', 'beige', 'bisque',
  'blanchedalmond', 'blueviolet', 'brown', 'burlywood', 'cadetblue',
  'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson',
  'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen',
  'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange',
  'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue',
  'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink',
  'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite',
  'forestgreen', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'greenyellow',
  'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki',
  'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue',
  'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen',
  'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue',
  'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow',
  'limegreen', 'linen', 'magenta', 'mediumaquamarine', 'mediumblue',
  'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue',
  'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue',
  'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'oldlace', 'olivedrab',
  'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
  'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum',
  'powderblue', 'rebeccapurple', 'rosybrown', 'royalblue', 'saddlebrown',
  'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'skyblue',
  'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue',
  'tan', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'whitesmoke',
  'yellowgreen', 'transparent'
] as const;

// System colors (CSS Color Level 4)
const systemColors = [
  'AccentColor', 'AccentColorText', 'ActiveText', 'ButtonBorder', 'ButtonFace',
  'ButtonText', 'Canvas', 'CanvasText', 'Field', 'FieldText', 'GrayText',
  'Highlight', 'HighlightText', 'LinkText', 'Mark', 'MarkText', 'SelectedItem',
  'SelectedItemText', 'VisitedText',
  // Deprecated but still supported
  'ActiveBorder', 'ActiveCaption', 'AppWorkspace', 'Background', 'ButtonHighlight',
  'ButtonShadow', 'CaptionText', 'InactiveBorder', 'InactiveCaption',
  'InactiveCaptionText', 'InfoBackground', 'InfoText', 'Menu', 'MenuText',
  'Scrollbar', 'ThreeDDarkShadow', 'ThreeDFace', 'ThreeDHighlight',
  'ThreeDLightShadow', 'ThreeDShadow', 'Window', 'WindowFrame', 'WindowText'
] as const;

// Regex patterns for color functions
const patterns = {
  // Hex colors: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
  hex: new RegExp(`^#(?:${HEX}{3,4}|${HEX}{6}|${HEX}{8})$`),
  
  // rgb() and rgba() - modern space syntax, legacy comma syntax, and relative colors
  rgb: new RegExp(
    `^rgba?\\(${WS}${withFrom(`(?:${BYTE_VALUE}${WS_REQUIRED}){2}${BYTE_VALUE}(?:${ALPHA_SLASH})?`)}${WS}\\)$` +
    `|^rgba?\\(${WS}${BYTE_VALUE}${WS},${WS}${BYTE_VALUE}${WS},${WS}${BYTE_VALUE}(?:${WS},${WS}${ALPHA})?${WS}\\)$`,
    'i'
  ),
  
  // hsl() and hsla() - with relative color support
  hsl: new RegExp(
    `^hsla?\\(${WS}${withFrom(`(?:${ANGLE_OR_NONE}${WS_REQUIRED}){1,2}${NUMBER_OR_NONE}${WS_REQUIRED}${NUMBER_OR_NONE}(?:${ALPHA_SLASH})?`)}${WS}\\)$` +
    `|^hsla?\\(${WS}${ANGLE}${WS},${WS}${PERCENTAGE}${WS},${WS}${PERCENTAGE}(?:${WS},${WS}${ALPHA})?${WS}\\)$`,
    'i'
  ),
  
  // hwb() - with relative color support
  hwb: new RegExp(
    `^hwb\\(${WS}${withFrom(`${ANGLE_OR_NONE}${WS_REQUIRED}${NUMBER_OR_NONE}${WS_REQUIRED}${NUMBER_OR_NONE}(?:${ALPHA_SLASH})?`)}${WS}\\)$`,
    'i'
  ),
  
  // lab() - with relative color support
  lab: new RegExp(
    `^lab\\(${WS}${withFrom(`${NUMBER_OR_NONE}${WS_REQUIRED}${SIGNED_NUMBER_OR_NONE}${WS_REQUIRED}${SIGNED_NUMBER_OR_NONE}(?:${ALPHA_SLASH})?`)}${WS}\\)$`,
    'i'
  ),
  
  // lch() - with relative color support
  lch: new RegExp(
    `^lch\\(${WS}${withFrom(`${NUMBER_OR_NONE}${WS_REQUIRED}${NUMBER_OR_NONE}${WS_REQUIRED}${ANGLE_OR_NONE}(?:${ALPHA_SLASH})?`)}${WS}\\)$`,
    'i'
  ),
  
  // oklab() - with relative color support
  oklab: new RegExp(
    `^oklab\\(${WS}${withFrom(`${NUMBER_OR_NONE}${WS_REQUIRED}${SIGNED_NUMBER_OR_NONE}${WS_REQUIRED}${SIGNED_NUMBER_OR_NONE}(?:${ALPHA_SLASH})?`)}${WS}\\)$`,
    'i'
  ),
  
  // oklch() - with relative color support
  oklch: new RegExp(
    `^oklch\\(${WS}${withFrom(`${NUMBER_OR_NONE}${WS_REQUIRED}${NUMBER_OR_NONE}${WS_REQUIRED}${ANGLE_OR_NONE}(?:${ALPHA_SLASH})?`)}${WS}\\)$`,
    'i'
  ),
  
  // color() - generic color space function with relative color support
  color: new RegExp(
    `^color\\(${WS}${withFrom(`(?:srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020|xyz|xyz-d50|xyz-d65)(?:${WS_REQUIRED}${SIGNED_NUMBER_OR_NONE}){3}(?:${ALPHA_SLASH})?`)}${WS}\\)$`,
    'i'
  ),
  
  // color-mix()
  colorMix: /^color-mix\(\s*in\s+[\w-]+/i,
  
  // light-dark()
  lightDark: /^light-dark\(\s*.+\s*,\s*.+\s*\)$/i,
};

/**
 * Validates a CSS color value against the formal syntax.
 * Supports: named colors, hex, rgb(), hsl(), hwb(), lab(), lch(), oklab(), oklch(),
 * color(), color-mix(), light-dark(), currentColor, system colors, and relative colors.
 */
function isValidCssColor(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  
  const trimmed = value.trim().toLowerCase();
  
  // Keywords
  if (trimmed === 'currentcolor' || trimmed === 'inherit' || trimmed === 'initial' || trimmed === 'unset') {
    return true;
  }
  
  // Named colors
  if ((namedColors as readonly string[]).includes(trimmed)) {
    return true;
  }
  
  // System colors (case-insensitive check)
  if (systemColors.some(c => c.toLowerCase() === trimmed)) {
    return true;
  }
  
  // Check all patterns
  return Object.values(patterns).some(regex => regex.test(value.trim()));
}

export const CssColorSchema = z.string().check(
  z.refine(isValidCssColor, { error: 'Invalid CSS color value' })
);

/**
 * CSS color value - supports all CSS color formats
 * @example 'red'
 * @example 'transparent'
 * @example 'currentcolor'
 * @example '#ff0000'
 * @example '#f00'
 * @example 'rgb(255, 0, 0)'
 * @example 'rgb(255 0 0 / 0.5)'
 * @example 'hsl(0, 100%, 50%)'
 * @example 'hsl(0deg 100% 50%)'
 * @example 'hwb(0 0% 0%)'
 * @example 'lab(50% 50 50)'
 * @example 'lch(50% 50 180)'
 * @example 'oklch(0.5 0.2 180)'
 * @example 'color(display-p3 1 0 0)'
 * @example 'color-mix(in srgb, red, blue)'
 * @example 'light-dark(white, black)'
 */
export type CssColor = 
  | typeof namedColors[number] 
  | typeof systemColors[number]
  | `#${string}`
  | `rgb(${string})`
  | `rgba(${string})`
  | `hsl(${string})`
  | `hsla(${string})`
  | `hwb(${string})`
  | `lab(${string})`
  | `lch(${string})`
  | `oklab(${string})`
  | `oklch(${string})`
  | `color(${string})`
  | `color-mix(${string})`
  | `light-dark(${string})`
  | 'currentcolor'
  | 'currentColor'
  | 'inherit'
  | 'initial'
  | 'unset';

// Export the named colors and system colors for reference
export { namedColors, systemColors };
