import { configs } from "@aws-appsync/eslint-plugin";
import { Linter, ESLint } from "eslint";

export const config: ESLint.ConfigData = {
  parser: "@typescript-eslint/parser", // Utiliza el parser de TypeScript
  plugins: ["@typescript-eslint", "@aws-appsync"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    ...(configs.recommended as Linter.Config).rules,
    // Agrega reglas adicionales o personalizadas aquí
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: "./tsconfig.json",
  },
};

export default config;
