// @ts-check

/**
 * Run this with: $ yarn generate-cities-cache
 */
const queryMap = require("./queryMap")
const preheatGraphQLCache = require("./preheatGraphQLCache")

// @ts-ignore
const cities = require("../data/cityDataSortedByDisplayPreference.json")

const QUERY_NAME = "MapRendererQuery"
const TTL = 3600 // 1 hour
const MAX_GRAPHQL_INT = 2147483647

const queryData = queryMap()[QUERY_NAME]

cities.forEach(city => {
  const queryParams = {
    documentID: queryData.ID,
    query: queryData.query,
    variables: {
      maxInt: MAX_GRAPHQL_INT,
      citySlug: city.slug,
    },
  }

  preheatGraphQLCache(queryParams, `${QUERY_NAME}-${city.slug}.json`, TTL)
})
