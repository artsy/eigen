const ts = require("typescript");
const originalTransform = require('./node_modules/react-native/packager/transformer');

const json5 = require('json5');
const {readFileSync} = require("fs")

const compilerOptions = json5.parse(readFileSync("tsconfig.json").toString())

module.exports = function (data, callback) {

  // Skip TS transpile for React Native et-al
  const shouldTranspile = data.sourceCode.includes(".tsx") || data.sourceCode.includes(".ts")
  if (shouldTranspile) {
    const transpiled = ts.transpileModule(data.sourceCode, { compilerOptions: compilerOptions.compilerOptions, moduleName: "asda" });
    data.sourceCode = transpiled.outputText
  }
  originalTransform(data, callback)
}