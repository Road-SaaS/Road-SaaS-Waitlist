import tseslint from "typescript-eslint"

export default [
  {
    ignores: ["node_modules/**", ".next/**", "tests/**", "scripts/**"],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["error", "warn"] }],
    },
  },
]
