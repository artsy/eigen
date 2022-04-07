#!/usr/bin/env yarn ts-node

require("dotenv").config()

import { GraphQLClient } from "graphql-request"
import { values } from "lodash"
import { exit, stdout } from "process"
import puppeteer from "puppeteer"
import { logRunningRequest } from "../src/app/utils/loggers"

const login = async (): Promise<{ userId: string; accessToken: string }> => {
  console.log("Logging in..")
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto("https://staging.artsy.net")
  await page.click('aria/button[name="Log in"]')
  await page.click('aria/textbox[name="Enter your email address"]')
  await page.type(
    'aria/textbox[name="Enter your email address"]',
    process.env.FRESHNESS_TEST_EMAIL ?? "missing email"
  )
  await page.click('aria/textbox[name="Enter your password"]')
  await page.type(
    'aria/textbox[name="Enter your password"]',
    process.env.FRESHNESS_TEST_PASSWORD ?? "missing password"
  )
  await page.click('aria/pushbutton[name="Log in"]')
  await page.waitForNavigation()
  const { id: userId, accessToken } = await page.evaluate("sd.CURRENT_USER")
  console.log("Logged in.")
  return { userId, accessToken }
}

const doIt = async (): Promise<never> => {
  const { userId, accessToken } = await login()
  const metaphysics = new GraphQLClient("https://metaphysics-staging.artsy.net/v2", {
    headers: {
      "X-Access-Token": accessToken,
      "X-User-Id": userId,
    },
  })

  const allQueries = values(require("./data/complete.queryMap.json")) as string[]
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
  const queriesWithVars = queries.filter(
    (q) => !queriesWithoutVars.includes(q) && !queriesWithCursor.includes(q)
  )
  const mutations = allNonTestQueries.filter((q) => q.startsWith("mutation"))

  console.warn(`Skipping ${mutations.length} mutations`)
  console.log(`Skipping ${allQueries.length - allNonTestQueries.length} test queries`)
  console.warn(`Skipping ${queriesWithCursor.length} queries with cursors`)

  interface Error {
    request: string
    error: string
  }
  const errors: Error[] = [] as Error[]
  const executeRequests = async (
    requests: string[],
    description: string,
    options: { verbose?: boolean; vars?: { [Var: string]: any } } = { verbose: false }
  ) => {
    const log = (...args: Parameters<typeof console.log>) => {
      if (options.verbose) {
        console.log(...args)
      }
    }

    if (logRunningRequest) {
      console.log(`Running ${requests.length} ${description}`)
    }
    await Promise.all(
      requests.map(async (req) => {
        try {
          log(req)
          const response = await metaphysics.request(req, options.vars)
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

  await executeRequests(queriesWithoutVars, "no-var queries")

  await executeRequests(queriesWithVars, "var queries", {
    vars: {
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
    },
  })

  // end game
  if (errors.length !== 0) {
    console.error(`Oh noes! ${errors.length} queries failed!`)
    errors.map(({ request, error }) => {
      console.warn("- The following query:")
      console.log(request)
      console.warn("failed with error:")
      console.log(error)
    })
    console.error(`Again, ${errors.length} queries failed. Look above for more details.`)
    exit(-1)
  }
  console.log("Success! Our queries are so so fresh.")
  exit(0)
}

doIt()
