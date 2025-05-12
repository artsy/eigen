const list = ["app", "palette", "shared", "__generated__", "images", "animations"]

// babel module resolver just needs `*`
const babelModuleResolverAlias = list.reduce((acc, name) => {
  acc[name] = `./src/${name}`
  acc[`${name}/*`] = `./src/${name}/*`
  return acc
}, {})

babelModuleResolverAlias["images"] = "./images" // Add alias for 'images' folder
babelModuleResolverAlias["images/*"] = "./images/*" // Support for nested files
babelModuleResolverAlias["animations"] = "./animations" // Add alias for 'animations' folder
babelModuleResolverAlias["animations/*"] = "./animations/*" // Support for nested files

// jest allows for regex
const jestModuleNameMap = list.reduce((acc, name) => {
  acc[`^${name}$`] = `<rootDir>/src/${name}`
  acc[`^${name}/(.*)`] = `<rootDir>/src/${name}/$1`
  return acc
}, {})
jestModuleNameMap["^images/(.*)"] = "<rootDir>/images/$1"
jestModuleNameMap["^animations/(.*)"] = "<rootDir>/animations/$1"

module.exports = {
  babelModuleResolverAlias,
  jestModuleNameMap,
}
