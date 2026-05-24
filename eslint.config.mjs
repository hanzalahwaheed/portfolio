import js from "@eslint/js"
import tseslint from "typescript-eslint"

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".tanstack/**",
      ".nitro/**",
      ".output/**",
      ".wrangler/**",
      "dist/**",
      "build/**",
      "portfolio-tanstack-template/**",
      "src/routeTree.gen.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: "readonly",
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        navigator: "readonly",
        FormData: "readonly",
        File: "readonly",
        Response: "readonly",
        Request: "readonly",
        Headers: "readonly",
        Buffer: "readonly",
        process: "readonly",
        React: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]

export default eslintConfig
