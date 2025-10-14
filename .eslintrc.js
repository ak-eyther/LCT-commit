module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // Integrates Prettier with ESLint
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // Shows Prettier errors as ESLint errors
    'no-console': 'warn', // Warns about console.log statements
    'no-unused-vars': 'warn', // Warns about unused variables
    'no-undef': 'error', // Errors on undefined variables
  },
  globals: {
    // Add any global variables your project uses
  },
};
