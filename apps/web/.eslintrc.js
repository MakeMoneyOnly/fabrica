module.exports = {
  extends: ['next/core-web-vitals'],
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
    // Disable problematic rules for now
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: ['.next/', 'out/', 'node_modules/', 'public/', 'coverage/'],
};
