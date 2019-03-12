const { BREAK, parse, visit } = require("graphql")

const queries = require("../src/__generated__/complete.queryMap.json")

module.exports = function queryMap() {
  const result = {}
  Object.keys(queries).forEach(ID => {
    const query = queries[ID]
    const ast = parse(query)
    let queryName = null
    visit(ast, {
      OperationDefinition(node) {
        queryName = node.name.value
        return BREAK
      },
    })
    if (!queryName) {
      throw new Error(`Unable to find query name for ID ${ID}`)
    }
    result[queryName] = {
      ID,
      query,
    }
  })
  return result
}
