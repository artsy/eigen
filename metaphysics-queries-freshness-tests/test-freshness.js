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

  const errors = []
  const executeRequests = async (requests, description, verbose = false) => {
    const log = (...args) => {
      if (verbose) {
        console.log(...args)
      }
    }

    console.log(`Running ${requests.length} ${description}`)
    await Promise.all(
      requests.map(async (req) => {
        try {
          log(req)
          const response = await metaphysics.request(req, {
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
          stdout.write(".")
          log(JSON.stringify(response))
        } catch (e) {
          stdout.write("x")
          errors.push({ request: req, error: e })
        }
      })
    )
    console.log("")
  }

  executeRequests(queriesWithoutVars, "no-var queries")

  executeRequests(queriesWithVars, "var queries")

  // end game
  if (errors.length !== 0) {
    console.error(`${errors.length} queries failed!`)
    errors.map(({ request, error }) => {
      console.warn("- The following query:")
      console.log(request)
      console.warn("failed with error:")
      console.log(error)
    })
    exit(-1)
  }
  console.log("Success! Our queries are so so fresh.")
  exit(0)
}

doIt()
