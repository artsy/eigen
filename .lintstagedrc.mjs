export default {
  "*": "yarn detect-secrets:hook",
  "*.@(ts|tsx)": ["yarn lint", "yarn prettier-write"],
  "*.@(json|md)": ["yarn prettier-write"],
}
