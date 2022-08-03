import { ModalStack } from "app/navigation/ModalStack"
import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { postEventToProviders } from "app/utils/track/providers"
import { isEqual } from "lodash"

import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { ArtistQueryRenderer } from "./Artist"

jest.unmock("react-tracking")

type ArtistQueries = "ArtistAboveTheFoldQuery" | "ArtistBelowTheFoldQuery"

describe("Artist", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  function mockMostRecentOperation(name: ArtistQueries, mockResolvers: MockResolvers = {}) {
    expect(
      getMockRelayEnvironment().mock.getMostRecentOperation().request.node.operation.name
    ).toBe(name)
    resolveMostRecentRelayOperation({
      ID({ path }) {
        // need to make sure artist id is stable between above-and-below-the-fold queries to avoid cache weirdness
        if (isEqual(path, ["artist", "id"])) {
          return "artist-id"
        }
      },
      ...mockResolvers,
    })
  }

  const TestWrapper = (props: Record<string, any>) => (
    <ModalStack>
      <ArtistQueryRenderer artistID="ignored" environment={getMockRelayEnvironment()} {...props} />
    </ModalStack>
  )

  it("returns an empty state if artist has no artworks", async () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)
    const emptyTitle = "No works available by the artist at this time"
    const emptyMessage = "Create an Alert to receive notifications when new works are added"

    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: false,
          counts: {
            related_artists: 0,
          },
          statuses: {
            articles: false,
            artworks: false,
            auctionLots: false,
          },
        }
      },
    })

    expect(getByText(emptyTitle)).toBeTruthy()
    expect(getByText(emptyMessage)).toBeTruthy()
  })

  it("should render Artworks tab by default", async () => {
    const { queryByText } = renderWithWrappers(<TestWrapper />)

    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: false,
          counts: { related_artists: 0, partner_shows: 0 },
          statuses: {
            artworks: false,
            auctionLots: false,
            articles: false,
          },
        }
      },
    })

    expect(queryByText("Artworks")).toBeTruthy()
    expect(queryByText("Overview")).toBeFalsy()
    expect(queryByText("Insights")).toBeFalsy()
  })

  it("returns Overview tab if artist has metadata", async () => {
    const { queryByText } = renderWithWrappers(<TestWrapper />)

    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: true,
          counts: { related_artists: 0, partner_shows: 0 },
          statuses: {
            artworks: false,
            auctionLots: false,
            articles: false,
          },
        }
      },
    })

    expect(queryByText("Overview")).toBeTruthy()
  })

  it("returns Overview tab if artist has only articles", async () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: false,
          counts: { related_artists: 0, partner_shows: 0 },
          statuses: {
            artworks: false,
            auctionLots: false,
            articles: true,
          },
        }
      },
    })

    expect(getByText("Overview")).toBeTruthy()
  })

  it("returns three tabs if artist has metadata, works, and auction results", async () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: true,
          counts: { articles: 1, related_artists: 0, artworks: 1, partner_shows: 1 },
          statuses: {
            auctionLots: true,
            artworks: true,
          },
        }
      },
    })

    expect(getByText("Overview")).toBeTruthy()
    expect(getByText("Artworks")).toBeTruthy()
    expect(getByText("Insights")).toBeTruthy()
  })

  it("hides Artist insights tab when there are no auction results", async () => {
    const { queryByText } = renderWithWrappers(<TestWrapper />)

    mockMostRecentOperation("ArtistAboveTheFoldQuery", {
      Artist() {
        return {
          has_metadata: true,
          statuses: {
            artworks: true,
            auctionLots: false,
          },
        }
      },
    })

    expect(queryByText("Overview")).toBeTruthy()
    expect(queryByText("Artworks")).toBeTruthy()
    expect(queryByText("Insights")).toBeFalsy()
  })

  it("tracks a page view", () => {
    renderWithWrappers(<TestWrapper />)

    mockMostRecentOperation("ArtistAboveTheFoldQuery")

    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect(postEventToProviders).toHaveBeenNthCalledWith(1, {
      context_screen: "Artist",
      context_screen_owner_id: '<mock-value-for-field-"internalID">',
      context_screen_owner_slug: '<mock-value-for-field-"slug">',
      context_screen_owner_type: "Artist",
    })
  })
})
