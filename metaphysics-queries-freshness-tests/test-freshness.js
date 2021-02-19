#!/usr/bin/env node

// @ts-check

const { GraphQLClient } = require("graphql-request")
const { values } = require("lodash")
const { exit, stdout } = require("process")

const [userId, token] = [
]

const metaphysics = new GraphQLClient("https://metaphysics-staging.artsy.net/v2", {
  headers: {
    // sd.CURRENT_USER.id and accessToken
    "X-Access-Token": token,
    "X-User-Id": userId,
  },
})

const doIt = async () => {
  const allQueries = values(require("../data/complete.queryMap.json"))
  const problemQueries = allQueries.filter(
    (q) =>
      q.includes("$conversationID") ||
      q.includes("ArtistRailNewSuggestionQuery") ||
      q.includes("ArtistSeriesQuery") ||
      q.includes("ArtworkMediumQuery") ||
      q.includes("AuctionResultQuery") ||
      q.includes("AutosuggestResultsQuery") ||
      q.includes("BidFlowQuery") ||
      q.includes("BidderPositionQuery") ||
      q.includes("BottomTabsModelFetchCurrentUnreadConversationCountQuery") ||
      q.includes("ConfirmBidRefetchQuery") ||
      q.includes("ConsignmentsArtistQuery") ||
      q.includes("ConversationQuery") ||
      q.includes("FairArticlesQuery") ||
      q.includes("FairExhibitorsQuery") ||
      q.includes("FeatureQuery") ||
      q.includes("GeneQuery") ||
      q.includes("InboxOldQuery") ||
      q.includes("MapRendererQuery") ||
      q.includes("PartnerLocationsQuery") ||
      q.includes("PartnerQuery") ||
      q.includes("PartnerRefetchQuery") ||
      q.includes("PriceSummaryQuery") ||
      q.includes("RegistrationFlowQuery") ||
      q.includes("SaleAboveTheFoldQuery") ||
      q.includes("SaleActiveBidsRefetchQuery") ||
      q.includes("SaleBelowTheFoldQuery") ||
      q.includes("SaleInfoQueryRendererQuery") ||
      q.includes("SaleRefetchQuery") ||
      q.includes("SelectMaxBidRefetchQuery") ||
      q.includes("ShowMoreInfoQuery") ||
      q.includes("ShowQuery") ||
      q.includes("VanityURLEntityQuery")
  )
  const allQueriesToCheck = allQueries.filter((q) => !problemQueries.includes(q))
  const allNonTestQueries = allQueriesToCheck.filter(
    (q) => !q.includes("Test") && !q.includes("Mock") && !q.includes("Fixtures")
  )
  const queries = allNonTestQueries.filter((q) => q.startsWith("query"))
  const queriesWithoutVars = queries.filter((q) => !q.includes("$"))
  const queriesWithCursor = queries.filter((q) => q.includes("$cursor"))
  const queriesWithVars = queries.filter((q) => !queriesWithoutVars.includes(q) && !queriesWithCursor.includes(q))
  const mutations = allNonTestQueries.filter((q) => q.startsWith("mutation"))

  console.warn(`Skipping ${mutations.length} mutations`)
  console.log(`Skipping ${allQueries.length - allNonTestQueries.length} test queries`)
  console.warn(`Skipping ${queriesWithCursor.length} queries with cursors`)

  console.log(`Running ${queriesWithoutVars.length} no-var queries`)
  await Promise.all(
    queriesWithoutVars.map(async (q) => {
      try {
        stdout.write(".")
        // console.log(q)
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
  console.log(`Running ${queriesWithVars.length} var queries`)
  await Promise.all(
    queriesWithVars.map(async (q) => {
      try {
        stdout.write(".")
        // console.log(q)
        const r = await metaphysics.request(q, {
          artworkID: "felipe-pantone-subtractive-variability-silk-robe-w-slash-j-balvin",
          artworkSlug: "felipe-pantone-subtractive-variability-silk-robe-w-slash-j-balvin",
          fairID: "london-art-fair-edit",
          citySlug: "athens-greece",
          artistInternalID: "4dd1584de0091e000100207c", // banksy
          artistSlug: "banksy",
          artistID: "banksy",
          medium: "prints",
          collectionID: "agnes-martin-lithographs",
          viewingRoomID: "movart-mario-macilau-circle-of-memories",
          isPad: false,
          heroImageVersion: "NARROW",
          count: 4,
        })
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
