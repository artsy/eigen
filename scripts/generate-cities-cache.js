/**
 * Run this with: $ yarn generate-cities-cache
 */

const fs = require("fs")
const https = require("https")
const path = require("path")
const queryMap = require("./queryMap")
const cities = require("../data/cityDataSortedByDisplayPreference.json")

const QUERY_NAME = "MapRendererQuery"
const TTL = 3600 // 1 hour

const MAX_GRAPHQL_INT = 2147483647

const assetsDir = path.resolve(__dirname, "../Pod/Assets/PreHeatedGraphQLCache")
const queryData = queryMap()[QUERY_NAME]

cities.forEach(city => {
  const queryParams = {
    // We don't use the persisted ID here because the queries may not actually have been persisted yet.
    query: queryData.query,
    variables: {
      maxInt: MAX_GRAPHQL_INT,
      citySlug: city.slug,
    },
  }

  const data = JSON.stringify(queryParams)
  const options = {
    hostname: "metaphysics-production.artsy.net",
    port: 443,
    path: "/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  }

  const req = https.request(options, res => {
    if (res.statusCode !== 200) {
      throw new Error(`Failed with status code: ${res.statusCode}`)
    }

    const responseData = []
    res.on("data", chunk => responseData.push(chunk))

    res.on("end", () => {
      const graphqlResponse = JSON.parse(Buffer.concat(responseData).toString("utf8"))
      if (graphqlResponse.errors && graphqlResponse.errors.length > 0) {
        throw new Error(`Failed with GraphQL errors: ${JSON.stringify(graphqlResponse.errors)}`)
      }
      fs.writeFile(
        path.join(assetsDir, `${QUERY_NAME}-${city.slug}.json`),
        JSON.stringify({
          // We fetched using the actual query, but we want to simulate a runtime query, which uses the persisted ID.
          queryParams: { documentID: queryData.ID, variables: queryParams.variables },
          graphqlResponse,
          ttl: TTL,
        }),
        "utf8",
        error => {
          if (error) throw error
        }
      )
    })
  })

  req.on("error", error => {
    throw error
  })

  req.write(data)
  req.end()
})
