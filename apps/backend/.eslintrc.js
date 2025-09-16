module.exports = {
  extends: ['@habesha/eslint-config'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // Backend-specific rules can be added here
  },
  ignorePatterns: ['dist/', 'node_modules/', 'coverage/'],
};
