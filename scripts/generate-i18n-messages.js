

const glob = require("glob")
const path = require("path")
const fs = require("fs")


function isBuffer(obj) {
  return (
    obj &&
    obj.constructor &&
    typeof obj.constructor.isBuffer === "function" &&
    obj.constructor.isBuffer(obj)
  )
}

function keyIdentity(key) {
  return key
}

function flatten(target, opts) {
  opts = opts || {}

  const delimiter = opts.delimiter || "."
  const maxDepth = opts.maxDepth
  const transformKey = opts.transformKey || keyIdentity
  const output = {}

  function step(object, prev, currentDepth) {
    currentDepth = currentDepth || 1
    Object.keys(object).forEach((key) => {
      const value = object[key]
      const isarray = opts.safe && Array.isArray(value)
      const type = Object.prototype.toString.call(value)
      const isbuffer = isBuffer(value)
      const isobject = type === "[object Object]" || type === "[object Array]"

      const newKey = prev ? prev + delimiter + transformKey(key) : transformKey(key)

      if (
        !isarray &&
        !isbuffer &&
        isobject &&
        Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)
      ) {
        return step(value, newKey, currentDepth + 1)
      }

      output[newKey] = value
    })
  }

  step(target, undefined, undefined)

  return output
}


const generateLanguages = () =>
  glob
    .sync(path.join("./src", "**", "i18n/*.json"))
    .map((file) => ({
      key: path.basename(file).replace(/\.[^/.]+$/, ""),
      content: flatten(JSON.parse(fs.readFileSync(file, "utf-8"))),
    }))
    .reduce((result, file) => {
      result[file.key] = Object.assign({}, result[file.key], file.content)
      return result
    }, {})


const main = async () => {
  const dirPath = path.join("./src", "/__generated__languages__")
  console.log(fs.existsSync(dirPath))
  !fs.existsSync(dirPath) &&
    fs.mkdir(dirPath, (err) => {
      if (err) {
          return console.error(err);
      }
      console.log(`${dirPath} directory created successfully!`);
    })
  const languages = generateLanguages()
  const data = `export default ${JSON.stringify(languages)}`
  fs.readdirSync(dirPath).forEach(file => fs.rmSync(`${dirPath}/${file}`))
  const filePath = path.join(dirPath, '/languages.ts')
  fs.writeFile(filePath, data, () => null)
}

main()
