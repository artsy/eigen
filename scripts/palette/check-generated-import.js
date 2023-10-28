const fs = require("fs")
const path = require("path")

// Load the exportMap
const exportMapPath = path.join(__dirname, "exportMap.json")
const exportMap = JSON.parse(fs.readFileSync(exportMapPath, "utf-8"))

// Transform function from your Babel config
function transformImport(importName) {
  const relativePath = exportMap[importName]
  if (!relativePath) {
    console.error(`Import name ${importName} not found in exportMap.`)
    process.exit(1)
  }
  const adjustedPath = relativePath.replace("/src/", "/dist/").replace(/\.tsx?$/, "")
  return `@artsy/palette-mobile${adjustedPath}`
}

// Get component name from command-line argument
const componentName = process.argv[2]
if (!componentName) {
  console.error("Please provide a component name as a command-line argument.")
  process.exit(1)
}

// Generate and print the transformed import path
const transformedImportPath = transformImport(componentName)
console.log(`Transformed import path for ${componentName}: ${transformedImportPath}`)
