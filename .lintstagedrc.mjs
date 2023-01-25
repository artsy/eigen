export default {
  "*.@(ts|tsx)": ["yarn lint", "yarn prettier-write"],
  "*.@(json|md)": ["yarn prettier-write"],
  "*": ["yarn secrets:check:staged", "yarn betterer:precommit"],
}
