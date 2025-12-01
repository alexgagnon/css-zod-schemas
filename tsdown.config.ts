import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/**/*.ts',
  dts: true,
  // minify: true, // oxc minification is still buggy
})