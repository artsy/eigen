const queryMap = require("./queryMap")()
const entries = Object.keys(queryMap).map(queryName => `@"${queryName}": @"${queryMap[queryName].ID}"`)

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
