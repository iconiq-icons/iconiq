export default {
  '*.{js,jsx,ts,tsx}': ['eslint --config eslint.config.mjs --fix', 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
};
