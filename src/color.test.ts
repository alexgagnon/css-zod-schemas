import { describe, it } from 'vitest';
import { CssColorSchema } from './color.js';


describe('CssColorSchema', () => {
  describe('named colors', () => {
    it('should accept basic named colors', ({ expect }) => {
      expect(CssColorSchema.parse('red')).toBe('red');
      expect(CssColorSchema.parse('blue')).toBe('blue');
      expect(CssColorSchema.parse('transparent')).toBe('transparent');
    });

    it('should accept extended named colors', ({ expect }) => {
      expect(CssColorSchema.parse('aliceblue')).toBe('aliceblue');
      expect(CssColorSchema.parse('rebeccapurple')).toBe('rebeccapurple');
    });
  });

  describe('keywords', () => {
    it('should accept currentcolor', ({ expect }) => {
      expect(CssColorSchema.parse('currentcolor')).toBe('currentcolor');
      expect(CssColorSchema.parse('currentColor')).toBe('currentColor');
    });

    it('should accept CSS-wide keywords', ({ expect }) => {
      expect(CssColorSchema.parse('inherit')).toBe('inherit');
      expect(CssColorSchema.parse('initial')).toBe('initial');
      expect(CssColorSchema.parse('unset')).toBe('unset');
    });
  });

  describe('system colors', () => {
    it('should accept system colors', ({ expect }) => {
      expect(CssColorSchema.parse('AccentColor')).toBe('AccentColor');
      expect(CssColorSchema.parse('ButtonFace')).toBe('ButtonFace');
      expect(CssColorSchema.parse('Canvas')).toBe('Canvas');
    });
  });

  describe('hex colors', () => {
    it('should accept 3-digit hex colors', ({ expect }) => {
      expect(CssColorSchema.parse('#f00')).toBe('#f00');
      expect(CssColorSchema.parse('#abc')).toBe('#abc');
    });

    it('should accept 4-digit hex colors with alpha', ({ expect }) => {
      expect(CssColorSchema.parse('#f00a')).toBe('#f00a');
    });

    it('should accept 6-digit hex colors', ({ expect }) => {
      expect(CssColorSchema.parse('#ff0000')).toBe('#ff0000');
      expect(CssColorSchema.parse('#abcdef')).toBe('#abcdef');
    });

    it('should accept 8-digit hex colors with alpha', ({ expect }) => {
      expect(CssColorSchema.parse('#ff0000aa')).toBe('#ff0000aa');
    });
  });

  describe('rgb() colors', () => {
    it('should accept legacy comma syntax', ({ expect }) => {
      expect(CssColorSchema.parse('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)');
      expect(CssColorSchema.parse('rgba(255, 0, 0, 0.5)')).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should accept modern space syntax', ({ expect }) => {
      expect(CssColorSchema.parse('rgb(255 0 0)')).toBe('rgb(255 0 0)');
      expect(CssColorSchema.parse('rgb(255 0 0 / 0.5)')).toBe('rgb(255 0 0 / 0.5)');
    });

    it('should accept percentages', ({ expect }) => {
      expect(CssColorSchema.parse('rgb(100% 0% 0%)')).toBe('rgb(100% 0% 0%)');
    });
  });

  describe('hsl() colors', () => {
    it('should accept legacy comma syntax', ({ expect }) => {
      expect(CssColorSchema.parse('hsl(0, 100%, 50%)')).toBe('hsl(0, 100%, 50%)');
      expect(CssColorSchema.parse('hsla(0, 100%, 50%, 0.5)')).toBe('hsla(0, 100%, 50%, 0.5)');
    });

    it('should accept modern space syntax', ({ expect }) => {
      expect(CssColorSchema.parse('hsl(0 100% 50%)')).toBe('hsl(0 100% 50%)');
      expect(CssColorSchema.parse('hsl(0deg 100% 50% / 0.5)')).toBe('hsl(0deg 100% 50% / 0.5)');
    });

    it('should accept angle units', ({ expect }) => {
      expect(CssColorSchema.parse('hsl(180deg 50% 50%)')).toBe('hsl(180deg 50% 50%)');
      expect(CssColorSchema.parse('hsl(3.14rad 50% 50%)')).toBe('hsl(3.14rad 50% 50%)');
    });
  });

  describe('hwb() colors', () => {
    it('should accept hwb format', ({ expect }) => {
      expect(CssColorSchema.parse('hwb(0 0% 0%)')).toBe('hwb(0 0% 0%)');
      expect(CssColorSchema.parse('hwb(180deg 20% 30% / 0.5)')).toBe('hwb(180deg 20% 30% / 0.5)');
    });
  });

  describe('lab() colors', () => {
    it('should accept lab format', ({ expect }) => {
      expect(CssColorSchema.parse('lab(50% 50 50)')).toBe('lab(50% 50 50)');
      expect(CssColorSchema.parse('lab(50% -50 50 / 0.5)')).toBe('lab(50% -50 50 / 0.5)');
    });
  });

  describe('lch() colors', () => {
    it('should accept lch format', ({ expect }) => {
      expect(CssColorSchema.parse('lch(50% 50 180)')).toBe('lch(50% 50 180)');
      expect(CssColorSchema.parse('lch(50% 50 180deg / 0.5)')).toBe('lch(50% 50 180deg / 0.5)');
    });
  });

  describe('oklab() and oklch() colors', () => {
    it('should accept oklab format', ({ expect }) => {
      expect(CssColorSchema.parse('oklab(0.5 0.2 0.1)')).toBe('oklab(0.5 0.2 0.1)');
    });

    it('should accept oklch format', ({ expect }) => {
      expect(CssColorSchema.parse('oklch(0.5 0.2 180)')).toBe('oklch(0.5 0.2 180)');
    });
  });

  describe('color() function', () => {
    it('should accept color space syntax', ({ expect }) => {
      expect(CssColorSchema.parse('color(display-p3 1 0 0)')).toBe('color(display-p3 1 0 0)');
      expect(CssColorSchema.parse('color(srgb 1 0 0 / 0.5)')).toBe('color(srgb 1 0 0 / 0.5)');
    });
  });

  describe('color-mix() function', () => {
    it('should accept color-mix syntax', ({ expect }) => {
      expect(CssColorSchema.parse('color-mix(in srgb, red, blue)')).toBe('color-mix(in srgb, red, blue)');
    });
  });

  describe('light-dark() function', () => {
    it('should accept light-dark syntax', ({ expect }) => {
      expect(CssColorSchema.parse('light-dark(white, black)')).toBe('light-dark(white, black)');
    });
  });

  describe('invalid colors', () => {
    it('should reject invalid colors', ({ expect }) => {
      expect(() => CssColorSchema.parse('not-a-color')).toThrow();
      expect(() => CssColorSchema.parse('#gg0000')).toThrow();
      expect(() => CssColorSchema.parse('rgb(300, 0, 0)')).toThrow();
      expect(() => CssColorSchema.parse('')).toThrow();
    });

    it('should reject non-string values', ({ expect }) => {
      expect(() => CssColorSchema.parse(123)).toThrow();
      expect(() => CssColorSchema.parse(null)).toThrow();
      expect(() => CssColorSchema.parse(undefined)).toThrow();
    });
  });
});
