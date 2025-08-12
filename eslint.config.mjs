// eslint.config.js
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import globals from "globals";
import tseslint from "typescript-eslint";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

export default [
    {
        ignores: ["**/node_modules/", ".git/", "**/dist/", "apps/docs/build/"],
    },
    ...compat.extends("next/core-web-vitals").map(config => ({
        ...config,
        files: ["apps/web/**/*.{js,jsx,ts,tsx}"],
    })),
    ...tseslint.configs.recommended.map(config => ({
        ...config,
        files: ["services/**/*.ts", "packages/**/*.ts"],
    })),
    {
        files: ["services/**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    eslintConfigPrettier,
];
