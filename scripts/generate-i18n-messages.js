

const glob = require("glob")
const path = require("path")
const fs = require("fs")
const prettier = require("prettier")
const flatten = require('flat')

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
  !fs.existsSync(dirPath) &&
    fs.mkdir(dirPath, (err) => {
      if (err) {
          return console.error(err);
      }
      console.log(`${dirPath} directory created successfully!`);
    })
  const languages = generateLanguages()
  let data = `export default ${JSON.stringify(languages)}`
  data = prettier.format(data, { parser: "babel" })
  fs.readdirSync(dirPath).forEach(file => fs.rmSync(`${dirPath}/${file}`))
  const filePath = path.join(dirPath, '/languages.ts')
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      throw err
    }
    console.log(`🟢 Translations generated in ${filePath}`)
  })
}

main()
