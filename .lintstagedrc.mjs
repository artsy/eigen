export default {
  "*.@(ts|tsx)": [
    "yarn lint",
    "yarn prettier-write",
    "node scripts/strictness-migration.js check-staged",
  ],
  "*.@(json|md)": ["yarn prettier-write"],
  "*": ["yarn secrets:check:staged", "yarn betterer:precommit"],
}
