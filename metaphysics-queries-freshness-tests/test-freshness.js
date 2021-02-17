#!/usr/bin/env node

// @ts-check

const { GraphQLClient } = require("graphql-request")
const { values, range } = require("lodash")
const { exit, stdout } = require("process")

const metaphysics = new GraphQLClient("https://metaphysics-staging.artsy.net/v2", {
  headers: {
  },
})

const doIt = async () => {
  const allQueries = values(require("../data/complete.queryMap.json"))
  const allNonTestQueries = allQueries.filter((q) => !q.includes("Test"))
  const queries = allNonTestQueries.filter((q) => q.startsWith("query"))
  const queriesWithoutVars = queries.filter((q) => !q.includes("$"))
  const mutations = allNonTestQueries.filter((q) => q.startsWith("mutation"))

  // console.log(queries.length)
  // console.log(queriesWithoutVars.length)
  console.warn(`Skipping ${mutations.length} mutations`)
  console.log(`Skipping ${allQueries.length - allNonTestQueries.length} test queries`)

  await Promise.all(
    queriesWithoutVars.map(async (q) => {
      try {
        stdout.write(".")
        const r = await metaphysics.request(q)
        // console.log(JSON.stringify(r))
      } catch (e) {
        console.log("")
        console.error("The following query failed:")
        console.warn(q)
        exit(-1)
      }
    })
  )

  console.log("")
  console.log("done")
  exit(0)
}

doIt()
