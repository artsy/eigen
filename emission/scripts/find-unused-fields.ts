import chalk from "chalk"
import dedent from "dedent"
import fs from "fs"
import json5 from "json5"
import klawSync from "klaw-sync"
import { flatten } from "lodash"
import { basename, relative } from "path"
import ts from "typescript"

function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    // prettier-ignore
    console.log(dedent`
      🔎  ${chalk.bold("find-unused-fields")} 🔍

      USAGE

        ${chalk.cyan.bold("  yarn find-unused-fields")} ${chalk.cyan("[fragment name]")}

      Add known exceptions in find-unused-fields.ts
    `)
    return
  }
  const languageService = getLanguageService()
  const sources = getSources(languageService)
  findUnusedFields(sources, languageService)
}

interface Ignored {
  fields: string[]
}
/**
 * Temporary way to ignore false positives due to indirect referencing
 */
const ignoredFragments: Record<string, Ignored> = {
  ArtistForSaleArtworksGrid_artist: {
    // pagination container, compiler complains without edges
    fields: ["forSaleArtworks/edges"],
  },
  ArtistNotForSaleArtworksGrid_artist: {
    // pagination container, compiler complains without edges
    fields: ["forSaleArtworks/edges"],
  },
  // ArtworkActions_artwork: {
  //   fields: ["dimensions", "image"],
  // },
  // ArtworkDetailsAboutTheWorkFromPartner_artwork: {
  //   fields: ["partner/locations/city", "partner/profile/id"],
  // },
  // ArtworkFilter_artist: {
  //   fields: [
  //     "name",
  //     "filtered_artworks/aggregations/counts/name",
  //     "filtered_artworks/aggregations/counts/id",
  //   ],
  // },
  // ArtworkImageBrowser_artwork: {
  //   fields: [
  //     "images/placeholder",
  //     "images/placeholder",
  //     "images/deepZoom/Image",
  //     "images/aspectRatio",
  //   ],
  // },
}

function getLanguageService(): ts.LanguageService {
  const { options, ...others } = ts.convertCompilerOptionsFromJson(
    json5.parse(fs.readFileSync("./tsconfig.json").toString()).compilerOptions,
    "."
  )

  if (others.errors && others.errors.length > 0) {
    throw new Error(JSON.stringify(others.errors))
  }

  const sourceFiles = klawSync("./src", {
    traverseAll: true,
    filter(item) {
      return item.path.endsWith(".ts") || item.path.endsWith(".tsx")
    },
  }).map(item => item.path)

  // Create the language service files
  return ts.createLanguageService(
    {
      getScriptFileNames: () => sourceFiles,
      getScriptVersion: _ => "0",
      getScriptSnapshot: fileName => {
        if (!fs.existsSync(fileName)) {
          return undefined
        }

        return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString())
      },
      getCurrentDirectory: () => process.cwd(),
      getCompilationSettings: () => options,
      getDefaultLibFileName: opts => ts.getDefaultLibFilePath(opts),
      fileExists: ts.sys.fileExists,
      readFile: ts.sys.readFile,
      readDirectory: ts.sys.readDirectory,
    },
    ts.createDocumentRegistry()
  )
}

const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0)

function getSources(languageService: ts.LanguageService): ts.SourceFile[] {
  let arg = process.argv[2]
  if (arg) {
    if (!fs.existsSync(arg)) {
      if (fs.existsSync(`src/__generated__/${arg}.graphql.ts`)) {
        arg = `src/__generated__/${arg}.graphql.ts`
      } else {
        console.error(chalk.red.bold("Bad argument"), chalk.bold("arg"))
        console.error("Try a relay fragment name or the path of a generated relay typings file.")
        process.exit(1)
      }
    }
    return [languageService.getProgram().getSourceFile(arg)]
  } else {
    // get all files
    return languageService
      .getProgram()
      .getSourceFiles()
      .filter(f => f.fileName.match("__generated__") && !f.fileName.endsWith("Query.graphql.ts"))
      .sort((a, b) => compare(basename(a.fileName), basename(b.fileName)))
  }
}

/**
 * Helper class for managing options and state while checking a fragment's
 * generated interface. Traverses the interface first and then reports any
 * errors found afterward.
 */
class FragmentCheckContext {
  errors: string[] = []

  constructor(
    public opts: {
      ignored: Ignored | null
      languageService: ts.LanguageService
      sourceFile: ts.SourceFile
      fragmentName: string
      rootNode: ts.TypeAliasDeclaration
    }
  ) {}

  check() {
    this.checkTypeNode({ node: this.opts.rootNode.type, path: [] })
    this.reportErrors()
  }

  private reportErrors() {
    if (!this.errors.length) {
      return
    }
    const { rootNode, sourceFile, languageService, fragmentName } = this.opts
    // We want to find the definition of the fragment so we can link to it
    // when reporting the errors.

    // We're working on the assumption that the fragment's generated type will
    // be referenced in the same file as the fragment was defined, although that
    // might not always be the case. It's no biggie if not, we'd just need to
    // cmd+shift+f.

    // Start out by finding references to our fragment
    const refs = languageService.findReferences(sourceFile.fileName, rootNode.name.getStart())
    if (!refs) {
      throw new Error(`Can't find references to fragment ${rootNode.name.getStart()}`)
    }

    // filter out generated files
    const fileNames = flatten(refs.map(({ references }) => references.map(r => r.fileName))).filter(
      fn => !fn.endsWith(".graphql.ts")
    )

    const searchString = `fragment ${fragmentName} on `
    let loc: {
      fileName: string
      line: number
      column: number
    } = null
    for (const fileName of fileNames) {
      const lines = fs
        .readFileSync(fileName)
        .toString()
        .split("\n")
      const line = lines.findIndex(l => l.includes(searchString))
      if (line < 0) {
        continue
      }
      const column = lines[line].indexOf(searchString)
      loc = {
        fileName,
        line: line + 1,
        column: column + 1,
      }
      break
    }

    let path = relative(process.cwd(), (loc && loc.fileName) || sourceFile.fileName)
    if (loc) {
      path += ":" + loc.line + ":" + loc.column
    }

    console.log("⚠️ ", chalk.bold(fragmentName), "→", chalk.cyan(path))
    console.log(this.errors.map(line => "  " + line).join("\n"))
    console.log()
  }

  // Recursively walk through the fragment's interface, checking each property's
  // references as we go.
  private checkTypeNode({ node, path }: { node: ts.TypeNode; path: ReadonlyArray<string> }) {
    if (ts.isParenthesizedTypeNode(node)) {
      if (!node.type) {
        console.error("bad node", node)
        return
      }
      this.checkTypeNode({ node: node.type, path })
      return
    }
    if (ts.isArrayTypeNode(node)) {
      this.checkTypeNode({ node: node.elementType, path })
      return
    }
    if (ts.isUnionTypeNode(node)) {
      for (const child of node.types) {
        this.checkTypeNode({ node: child, path })
      }
      return
    }
    if (ts.isTypeReferenceNode(node)) {
      if (node.typeArguments) {
        for (const child of node.typeArguments) {
          this.checkTypeNode({ node: child, path })
        }
      }
      return
    }
    if (!ts.isTypeLiteralNode(node)) {
      switch (node.kind) {
        case ts.SyntaxKind.AnyKeyword:
        case ts.SyntaxKind.NumberKeyword:
        case ts.SyntaxKind.BooleanKeyword:
        case ts.SyntaxKind.StringKeyword:
        case ts.SyntaxKind.NullKeyword:
          break
        default:
          this.errors.push(`Ignoring node of kind ${ts.SyntaxKind[node.kind]} at path ${path.join("/")}.`)
      }
      return
    }

    for (const property of node.members) {
      const propertyName = property.name.getText()
      // ignore meta properties
      if (propertyName.startsWith('"') || propertyName === "__typename" || propertyName === "id") {
        continue
      }

      const fieldPath = path.concat([propertyName]).join("/")

      if (this.opts.ignored && this.opts.ignored.fields.includes(fieldPath)) {
        continue
      }

      const findReferencesResult = this.opts.languageService.findReferences(
        node.getSourceFile().fileName,
        property.name.getStart()
      )

      if (!findReferencesResult) {
        this.errors.push(`No references found to field at path ${fieldPath}, this should never happen 😱`)
        continue
      }

      if (findReferencesResult.every(({ references }) => references.length === 1)) {
        this.errors.push(`${chalk.gray("Possibly unused field")} ${fieldPath}`)
        continue
      }

      const typeNodes = property.getChildren().filter(ts.isTypeNode)
      if (typeNodes.length !== 1) {
        this.errors.push(`️⁉️ Expected exactly one type node for child property at path ${fieldPath}`)
        continue
      }

      this.checkTypeNode({
        node: typeNodes[0],
        path: path.concat([propertyName]),
      })
    }
  }
}

function findUnusedFields(sources: ts.SourceFile[], languageService: ts.LanguageService) {
  ts.transform(sources, [
    context => file =>
      ts.visitEachChild(
        file,
        node => {
          // stop if this isn't a top-level type declaration e.g. `type Banana = { ... }`
          if (!ts.isTypeAliasDeclaration(node)) {
            return node
          }
          const fragmentName = node.name.getText()
          // stop if this isn't a fragment type e.g. we want Reject_order but not Reject_order$ref
          if (!fragmentName.match(/^\w+_\w+$/)) {
            return node
          }

          new FragmentCheckContext({
            fragmentName,
            ignored: ignoredFragments[fragmentName],
            languageService,
            sourceFile: file,
            rootNode: node,
          }).check()

          return node
        },
        context
      ),
  ])
}

main()
