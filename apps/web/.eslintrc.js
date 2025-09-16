module.exports = {
  extends: ['@habesha/eslint-config', 'next/core-web-vitals'],
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Frontend-specific rules can be added here
    // React-specific rules will be inherited from the shared config
  },
  ignorePatterns: ['.next/', 'out/', 'node_modules/', 'public/', 'coverage/'],
};
