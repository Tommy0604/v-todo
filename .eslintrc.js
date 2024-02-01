// .eslintrc.js
module.exports = {
  parser: "vue-eslint-parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: ["./tsconfig.json"],
    extraFileExtensions: [".vue"],
  },
  extends: ["plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-inferrable-types": "off",
    "prefer-const": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
  ignorePatterns: [".eslintrc.js", "vite.config.ts"],
}
