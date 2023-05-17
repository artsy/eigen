import { screen } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import _ from "lodash"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { MockPayloadGenerator, createMockEnvironment } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { ArtistQueryRenderer } from "./Artist"

jest.unmock("react-tracking")

type ArtistQueries = "ArtistQuery" | "SearchCriteriaQuery" | "ArtistArtworksQuery"

describe("Saved search banner on artist screen", () => {
  const originalError = console.error
  const originalWarn = console.warn
  let environment = createMockEnvironment()

  beforeEach(() => {
    environment = createMockEnvironment()
    console.error = jest.fn()
    console.warn = jest.fn()
  })

  afterEach(() => {
    environment = createMockEnvironment()
    console.error = originalError
    console.warn = originalWarn
  })

  function mockMostRecentOperation(name: ArtistQueries, mockResolvers: MockResolvers = {}) {
    expect(environment.mock.getMostRecentOperation().request.node.operation.name).toBe(name)
    environment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        ID({ path }) {
          // need to make sure artist id is stable between above-and-below-the-fold queries to avoid cache weirdness
          if (_.isEqual(path, ["artist", "id"])) {
            return "artist-id"
          }
        },
        ...mockResolvers,
      })
      return result
    })
  }

  const getTree = (searchCriteriaID?: string) =>
    renderWithHookWrappersTL(
      <ArtistQueryRenderer
        artistID="ignored"
        environment={environment as unknown as RelayModernEnvironment}
        searchCriteriaID={searchCriteriaID}
      />
    )

  it("should an error message when something went wrong during the search criteria query", async () => {
    getTree("something")

    rejectMostRecentRelayOperation(environment, new Error())
    mockMostRecentOperation("ArtistQuery", MockArtistQuery)

    await flushPromiseQueue()

    expect(screen.getByText("Sorry, an error occured")).toBeTruthy()
    expect(screen.getByText("Failed to get saved search criteria")).toBeTruthy()
  })

  it("should render saved search component", async () => {
    getTree("search-criteria-id")

    mockMostRecentOperation("SearchCriteriaQuery", MockSearchCriteriaQuery)
    mockMostRecentOperation("ArtistQuery", MockArtistQuery)

    await flushPromiseQueue()

    expect(screen.getAllByText("Create Alert")).not.toHaveLength(0)
  })
})

const MockSearchCriteriaQuery = {
  Me() {
    return {
      savedSearch: {
        attributionClass: ["limited edition", "open edition"],
        acquireable: true,
        inquireableOnly: true,
        offerable: null,
        atAuction: null,
        width: null,
        height: null,
      },
    }
  },
}
const MockArtistQuery = {
  Artist() {
    return {
      has_metadata: true,
      counts: { articles: 0, related_artists: 0, artworks: 1, partner_shows: 0 },
      auctionResultsConnection: {
        totalCount: 0,
      },
    }
  },
}
