import { fireEvent } from "@testing-library/react-native"
import { TrendingArtists_Test_Query } from "__generated__/TrendingArtists_Test_Query.graphql"
import { TrendingArtists } from "app/Scenes/Search/TrendingArtists"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("TrendingArtists", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<TrendingArtists_Test_Query>(
      graphql`
        query TrendingArtists_Test_Query {
          ...TrendingArtists_query
        }
      `,
      {}
    )

    return <TrendingArtists data={data} />
  }

  it("should render all artists", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        curatedTrendingArtists,
      }),
    })
    await flushPromiseQueue()

    expect(getByText("Artist One")).toBeTruthy()
    expect(getByText("Artist Two")).toBeTruthy()
  })

  it("should navigate to the artist screen", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        curatedTrendingArtists,
      }),
    })

    await flushPromiseQueue()
    await fireEvent.press(getByText("Artist One"))

    expect(navigate).toHaveBeenCalledWith("/artist/artist-one")
  })

  it("should track event when an artist is tapped", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        curatedTrendingArtists,
      }),
    })

    await flushPromiseQueue()

    fireEvent.press(getByText("Artist Two"))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedArtistGroup",
          "context_module": "trendingArtistsRail",
          "context_screen_owner_type": "search",
          "destination_screen_owner_id": "artist-two-id",
          "destination_screen_owner_slug": "artist-two",
          "destination_screen_owner_type": "artist",
          "horizontal_slide_position": 1,
          "type": "thumbnail",
        },
      ]
    `)
  })
})

const curatedTrendingArtists = {
  edges: [
    {
      node: {
        internalID: "artist-one-id",
        href: "/artist/artist-one",
        slug: "artist-one",
        name: "Artist One",
      },
    },
    {
      node: {
        internalID: "artist-two-id",
        href: "/artist/artist-two",
        slug: "artist-two",
        name: "Artist Two",
      },
    },
  ],
}
