module.exports = {
    '**/*.ts?(x)': () => 'npm run types',
    '*.{js,jsx,ts,tsx}': ['eslint --fix', 'eslint', 'prettier --write'],
};
