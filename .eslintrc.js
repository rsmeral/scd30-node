module.exports = {
  ignorePatterns: ['dist', 'node_modules'],
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    'max-len': ['warn', 120]
  }
};
