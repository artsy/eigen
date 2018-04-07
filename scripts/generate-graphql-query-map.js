const { BREAK, parse, visit } = require("graphql")

const queryMap = require("../src/__generated__/complete.queryMap.json")

const entries = Object.keys(queryMap).map(ID => {
  const query = queryMap[ID]
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
  return `@"${queryName}": @"${ID}"`
})

const content = `
static
NSString *
ARGraphQLQueryNameToID(NSString *name) {
  static NSDictionary *queryMap = nil;
  static dispatch_once_t onceToken = 0;
  dispatch_once(&onceToken, ^{
#ifdef DEBUG
    NSLog(@"[ARGraphQLQueryMap] Using static query map.");
#endif
    queryMap = @{
      ${entries.join(",\n      ")}
    };
  });
  return queryMap[name];
}
`

console.log(content)
