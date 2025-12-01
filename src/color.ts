import { z } from 'zod/mini';

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
  hex: /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
  
  // rgb() and rgba() - modern space syntax and legacy comma syntax
  rgb: /^rgba?\(\s*(?:(?:\d{1,3}%?|\d*\.\d+%?|none)\s+){2}(?:\d{1,3}%?|\d*\.\d+%?|none)(?:\s*\/\s*(?:\d*\.?\d+%?|none))?\s*\)$|^rgba?\(\s*(?:\d{1,3}%?|\d*\.\d+%?)\s*,\s*(?:\d{1,3}%?|\d*\.\d+%?)\s*,\s*(?:\d{1,3}%?|\d*\.\d+%?)(?:\s*,\s*(?:\d*\.?\d+%?))?\s*\)$/i,
  
  // hsl() and hsla()
  hsl: /^hsla?\(\s*(?:(?:\d*\.?\d+(?:deg|grad|rad|turn)?|none)\s+){1,2}(?:\d*\.?\d+%?|none)\s+(?:\d*\.?\d+%?|none)(?:\s*\/\s*(?:\d*\.?\d+%?|none))?\s*\)$|^hsla?\(\s*\d*\.?\d+(?:deg|grad|rad|turn)?\s*,\s*\d*\.?\d+%\s*,\s*\d*\.?\d+%(?:\s*,\s*\d*\.?\d+%?)?\s*\)$/i,
  
  // hwb()
  hwb: /^hwb\(\s*(?:\d*\.?\d+(?:deg|grad|rad|turn)?|none)\s+(?:\d*\.?\d+%?|none)\s+(?:\d*\.?\d+%?|none)(?:\s*\/\s*(?:\d*\.?\d+%?|none))?\s*\)$/i,
  
  // lab()
  lab: /^lab\(\s*(?:\d*\.?\d+%?|none)\s+(?:-?\d*\.?\d+%?|none)\s+(?:-?\d*\.?\d+%?|none)(?:\s*\/\s*(?:\d*\.?\d+%?|none))?\s*\)$/i,
  
  // lch()
  lch: /^lch\(\s*(?:\d*\.?\d+%?|none)\s+(?:\d*\.?\d+%?|none)\s+(?:\d*\.?\d+(?:deg|grad|rad|turn)?|none)(?:\s*\/\s*(?:\d*\.?\d+%?|none))?\s*\)$/i,
  
  // oklab()
  oklab: /^oklab\(\s*(?:\d*\.?\d+%?|none)\s+(?:-?\d*\.?\d+%?|none)\s+(?:-?\d*\.?\d+%?|none)(?:\s*\/\s*(?:\d*\.?\d+%?|none))?\s*\)$/i,
  
  // oklch()
  oklch: /^oklch\(\s*(?:\d*\.?\d+%?|none)\s+(?:\d*\.?\d+%?|none)\s+(?:\d*\.?\d+(?:deg|grad|rad|turn)?|none)(?:\s*\/\s*(?:\d*\.?\d+%?|none))?\s*\)$/i,
  
  // color() - generic color space function
  color: /^color\(\s*(?:srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020|xyz|xyz-d50|xyz-d65)(?:\s+(?:-?\d*\.?\d+%?|none)){3}(?:\s*\/\s*(?:\d*\.?\d+%?|none))?\s*\)$/i,
  
  // color-mix()
  colorMix: /^color-mix\(\s*in\s+[\w-]+/i,
  
  // light-dark()
  lightDark: /^light-dark\(\s*.+\s*,\s*.+\s*\)$/i,
  
  // Relative color syntax (from keyword)
  relativeColor: /^(?:rgb|hsl|hwb|lab|lch|oklab|oklch|color)\(\s*from\s+/i,
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

export const cssColorSchema = z.string().check(
  z.refine(isValidCssColor, { error: 'Invalid CSS color value' })
);

// Export types - union of named colors, system colors, and generic string for intellisense
export type CssColor = typeof namedColors[number] | typeof systemColors[number] | (string & {});

// Export the named colors and system colors for reference
export { namedColors, systemColors };
