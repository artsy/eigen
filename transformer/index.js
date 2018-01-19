"use strict"
const path = require("path")
const babel = require("babel-core")
const generate = require("babel-generator").default
const ts = require("typescript")
const tsConfig = require("../tsconfig.json")
const { File } = require("babel-core/lib/transformation/file")
const { SourceMapConsumer } = require("source-map")

const upstream = require("./upstream")
// const { compactMapping } = require("metro-bundler/src/Bundler/source-map")

const { compactMapping } = require("metro-source-map")

/**
 * This is a copy of upstream.transform, but modified to:
 * 1. Compile TypeScript with inline source-map.
 * 2. Generate a source-map when transforming with babel, which maps from TS to transformed JS code.
 * 3. Translate the transformed JS source-map from the original TS code.
 * 4. Store raw mappings of translated source-map so that RN can use them.
 **/
function transformTypeScript(src, filename, options) {
  options = options || {}

  const OLD_BABEL_ENV = process.env.BABEL_ENV
  process.env.BABEL_ENV = options.dev ? "development" : "production"

  try {
    const compilerOptions = buildTSCompilerOptionsConfig()
    const tsResult = ts.transpileModule(src, { compilerOptions })

    const babelConfig = buildBabelConfig(filename, options)
    const transformResult = babel.transform(tsResult.outputText, babelConfig)

    const generateResult = generate(
      transformResult.ast,
      {
        comments: false,
        compact: false,
        filename,
        sourceFileName: filename,
        sourceMaps: true,
      },
      src
    )

    // Translate generated source-map back to transformed JS source-map, which maps back to original TS code.
    generateResult.map = mergeSourceMaps(transformResult.map, generateResult.map)

    // Use translated map during bundling or fixed raw mappings during dev.
    let map
    if (options.generateSourceMaps) {
      map = generateResult.map
    } else {
      map = extractRawMappings(generateResult.map).map(compactMapping)
    }

    return {
      ast: transformResult.ast,
      code: generateResult.code,
      filename,
      map,
    }
  } finally {
    process.env.BABEL_ENV = OLD_BABEL_ENV
  }
}

function buildTSCompilerOptionsConfig() {
  return Object.assign({}, tsConfig.compilerOptions, { inlineSourceMap: true })
}

function buildBabelConfig(filename, options) {
  return Object.assign({}, upstream.buildBabelConfig(filename, options), { code: true, sourceMap: true })
}

/**
 * This makes the otherwise bound `File.prototype.mergeSourceMap()` method available as a general util function.
 * @see https://github.com/babel/babel/issues/5408
 */
function mergeSourceMaps(inputSourceMap, outputSourceMap) {
  // TODO: The `mergeSourceMap` function modifies the `mappings` of the `inputSourceMap`, so make a deep copy first as
  //       to not mutate the original copy.
  inputSourceMap = JSON.parse(JSON.stringify(inputSourceMap))
  return File.prototype.mergeSourceMap.apply({ opts: { inputSourceMap } }, [outputSourceMap])
}

/**
 * This rebuilds the `rawMappings` that would otherwise be collected during babel-generate.
 * @see https://github.com/babel/babel/blob/f7e2d88f/packages/babel-generator/src/source-map.js#L73-L87
 */
function extractRawMappings(sourceMap) {
  const consumer = new SourceMapConsumer(sourceMap)
  const rawMappings = []
  consumer.eachMapping(({ name, source, originalLine, originalColumn, generatedLine, generatedColumn }) => {
    rawMappings.push({
      name,
      source,
      original: {
        line: originalLine,
        column: originalColumn,
      },
      generated: {
        line: generatedLine,
        column: generatedColumn,
      },
    })
  })
  return rawMappings
}

function transform({ filename, localPath, options, src }) {
  try {
    let sourceCode = src
    if (filename && (path.extname(filename) == ".tsx" || path.extname(filename) == ".ts")) {
      sourceCode = transformTypeScript(sourceCode, filename, options)
    } else {
      sourceCode = upstream.transform(sourceCode, filename, options)
    }
    return sourceCode
  } catch (e) {
    console.error(e)
  }
}
module.exports.transform = transform
