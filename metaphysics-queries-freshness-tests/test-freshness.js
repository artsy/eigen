#!/usr/bin/env node

// @ts-check

require("dotenv").config()

const { GraphQLClient } = require("graphql-request")
const { values } = require("lodash")
const { exit, stdout } = require("process")
const puppeteer = require("puppeteer")

const doIt = async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto("https://staging.artsy.net")
  await page.click('aria/button[name="Log in"]')
  await page.click('aria/textbox[name="Enter your email address"]')
  await page.type('aria/textbox[name="Enter your email address"]', process.env.FRESHNESS_TEST_EMAIL)
  await page.click('aria/textbox[name="Enter your password"]')
  await page.type('aria/textbox[name="Enter your password"]', process.env.FRESHNESS_TEST_PASSWORD)
  await page.click('aria/pushbutton[name="Log in"]')
  await page.waitForNavigation()
  const { id: userId, accessToken: token } = await page.evaluate("sd.CURRENT_USER")

  const metaphysics = new GraphQLClient("https://metaphysics-staging.artsy.net/v2", {
    headers: {
      "X-Access-Token": token,
      "X-User-Id": userId,
    },
  })

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
