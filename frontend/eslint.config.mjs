import withNuxt from './.nuxt/eslint.config.mjs';
import prettierConfig from 'eslint-config-prettier';

export default withNuxt(
  prettierConfig, // Integrate Prettier configuration into the ESLint setup
);
