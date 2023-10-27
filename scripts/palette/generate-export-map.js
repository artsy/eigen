const fs = require("fs")
const path = require("path")

const rootDir = path.join(__dirname, "../../../palette-mobile")

let exportMap = {}

function traverseDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    let fullPath = path.join(dir, file)

    // Skip over node_modules and tests
    if (fullPath.includes("node_modules") || fullPath.includes("/tests/")) {
      return
    }

    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDir(fullPath)
    } else if (
      (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) &&
      !fullPath.endsWith("stories.tsx")
    ) {
      const fileContent = fs.readFileSync(fullPath, "utf-8")
      // A simple regex to match named exports. This might not catch all cases,
      // but it's a start. Adjust as needed.
      const exportRegex = /export\s+(?:const|let|var|function|class)\s+([a-zA-Z0-9_]+)/g
      let match
      while ((match = exportRegex.exec(fileContent))) {
        const componentName = match[1]
        exportMap[componentName] = fullPath.replace(rootDir, "").replace(/\\/g, "/")
      }
    }
  })
}

traverseDir(rootDir)

const outputPath = path.join(__dirname, "exportMap.json")
fs.writeFileSync(outputPath, JSON.stringify(exportMap, null, 2))

console.log(`Export map saved to ${outputPath}`)
