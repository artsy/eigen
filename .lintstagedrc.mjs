export default {
  "*": ["yarn secrets:check:staged", "yarn betterer:all && git add .betterer.results"],
  "*.@(ts|tsx)": ["yarn lint", "yarn prettier-write"],
  "*.@(json|md)": ["yarn prettier-write"],
}
