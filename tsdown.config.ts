import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  dts: true,
  format: ['esm'],
  platform: 'neutral',
  unbundle: true,
  // minify: true, // oxc minification is still buggy
})