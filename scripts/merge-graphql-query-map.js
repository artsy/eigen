const fs = require("fs")

const queryMap = require("../src/__generated__/complete.queryMap.json")
const mpQueryMapFilename = "../metaphysics/src/data/complete.queryMap.json"

if (!fs.existsSync(mpQueryMapFilename)) {
  console.error("Couldn't read local metaphysics query map.")
  return 1
}

const mpQueryMap = JSON.parse(fs.readFileSync(mpQueryMapFilename))

for (const key in queryMap) {
  if (!mpQueryMap[key]) {
    mpQueryMap[key] = queryMap[key]
  }
}

fs.writeFileSync(mpQueryMapFilename, JSON.stringify(mpQueryMap, null, 2))
console.log("IMPORTANT: Changes have been made to your local metaphysics repo, please PR them.")
