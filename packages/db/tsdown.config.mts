import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.mts'],
  format: ['esm'],
  clean: true,
  dts: true,
});
