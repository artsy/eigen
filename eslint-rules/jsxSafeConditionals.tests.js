const { ESLintUtils, TSESTree, AST_TOKEN_TYPES } = require("@typescript-eslint/utils")
const jsxSafeConditionals = require("./jsxSafeConditionals.js")

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    // ecmaVersion: 6,
    // sourceType: "module",
    // project: ["./tsconfig.json"],
    // tsconfigRootDir: "..",
  },
})

ruleTester.run("jsx-safe-conditionals", jsxSafeConditionals, {
  valid: [
    {
      code: `
      const Main = () => {
        const fpsCounter = false
        const num = 6
        const nullable: boolean | null = true

        return (
          <View>
            {fpsCounter && <FPSCounter />}
            {!!fpsCounter && <FPSCounter />}
            {!!nullable && <FPSCounter />}
          </View>
        )
      }
      `,
    },
  ],
  invalid: [
    // {
    //   code: `
    //   const Main = () => {
    //     const fpsCounter = false
    //     const num = 6
    //     const nullable: boolean | null = true
    //     return (
    //       <View>
    //         {fpsCounter && <FPSCounter />}
    //         {!!fpsCounter && <FPSCounter />}
    //         {num && <FPSCounter />}
    //         {!!num && <FPSCounter />}
    //         {nullable && <FPSCounter />}
    //         {!!nullable && <FPSCounter />}
    //       </View>
    //     )
    //   }
    //   `,
    //   errors: [
    //     {
    //       line: 5,
    //       column: 6,
    //       messageId: "jsxSafeConditionalsError",
    //     },
    //   ],
    // },
  ],
})
