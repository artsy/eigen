export default {
  "*": ["yarn secrets:check:staged"],
  "*.@(ts|tsx)": ["yarn lint", "yarn prettier-write"],
  "*.@(json|md)": ["yarn prettier-write"],
}
