// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // Ignora pastas de build e arquivos de config específicos
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/eslint.config.mjs",
      "**/nest-cli.json",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "module",
      parserOptions: {
        // Isso permite que o ESLint encontre automaticamente o tsconfig.json
        // mais próximo de cada arquivo que você abrir no monorepo
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      // Desativamos estas para evitar os erros falsos em Decorators de DTOs
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);
