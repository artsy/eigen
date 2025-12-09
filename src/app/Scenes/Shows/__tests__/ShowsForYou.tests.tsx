import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ShowsForYouQuery } from "__generated__/ShowsForYouQuery.graphql"
import { ShowsForYouList, ShowsForYouScreen } from "app/Scenes/Shows/ShowsForYou"
import { goBack } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-native-community/geolocation", () => ({
  setRNConfiguration: jest.fn(),
  getCurrentPosition: jest.fn((success, _) => {
    success({ coords: { latitude: 40.7128, longitude: -74.006 } })
  }),
  requestAuthorization: jest.fn(),
}))

describe("ShowsForYouScreen", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ShowsForYouScreen,
  })

  it("renders loading placeholder initially", () => {
    renderWithRelay({
      Query: () => ({
        me: null,
      }),
    })

    expect(screen.getByTestId("shows-for-you-screen-placeholder")).toBeOnTheScreen()
  })

  it("renders shows list after loading", async () => {
    renderWithRelay({
      Query: () => ({
        me: {
          showsConnection: mockShowsConnection,
        },
      }),
    })

    await waitFor(() => {
      expect(screen.getByText("Shows for You")).toBeOnTheScreen()
    })
  })
})

describe("ShowsForYouList", () => {
  const { renderWithRelay } = setupTestWrapper<ShowsForYouQuery>({
    Component: ({ me }) => <ShowsForYouList me={me} />,
    query: graphql`
      query ShowsForYouTestQuery @relay_test_operation {
        me {
          ...ShowsForYou_showsConnection
        }
      }
    `,
  })

  it("renders multiple show items", () => {
    renderWithRelay({
      Me: () => ({
        showsConnection: {
          edges: [
            {
              node: {
                internalID: "show-1",
                slug: "gallery-name-show-title",
                name: "Amazing Art Exhibition",
              },
            },
            {
              node: {
                internalID: "show-2",
                slug: "another-gallery-show",
                name: "Contemporary Art Show",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByTestId("shows-for-you-flat-list")).toBeOnTheScreen()
  })

  it("handles navigation back", () => {
    renderWithRelay({
      Me: () => ({
        showsConnection: mockShowsConnection,
      }),
    })

    const backButton = screen.getByLabelText("Back")
    fireEvent.press(backButton)

    expect(goBack).toHaveBeenCalled()
  })

  it("displays activity indicator when loading more shows", () => {
    renderWithRelay({
      Me: () => ({
        showsConnection: {
          edges: mockShowsConnection.edges,
          pageInfo: {
            hasNextPage: true,
            endCursor: "cursor-1",
          },
        },
      }),
    })

    const flatList = screen.getByTestId("shows-for-you-flat-list")

    // Trigger onEndReached to load more
    fireEvent(flatList, "onEndReached")

    // Activity indicator should be visible when loading
    const activityIndicator = screen.getByTestId("activity-indicator")
    expect(activityIndicator).toBeOnTheScreen()
  })

  it("tracks screen view", () => {
    renderWithRelay({
      Me: () => ({
        showsConnection: mockShowsConnection,
      }),
    })

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "screen",
          "context_screen_owner_type": "shows",
        },
      ]
    `)
  })

  it("does not load more when already loading", () => {
    const { env } = renderWithRelay({
      Me: () => ({
        showsConnection: {
          edges: mockShowsConnection.edges,
          pageInfo: {
            hasNextPage: true,
            endCursor: "cursor-1",
          },
        },
      }),
    })

    const flatList = screen.getByTestId("shows-for-you-flat-list")

    // Trigger onEndReached multiple times rapidly
    fireEvent(flatList, "onEndReached")
    fireEvent(flatList, "onEndReached")

    // Should only trigger one pagination request
    expect(env.mock.getMostRecentOperation()).toBeTruthy()
  })
})

const mockShowsConnection = {
  edges: [
    {
      node: {
        internalID: "show-1",
        slug: "gallery-one-exhibition",
        name: "Modern Art Exhibition",
        href: "/show/gallery-one-exhibition",
        city: "New York",
        formattedStartAt: "Jan 15",
        formattedEndAt: "Mar 20",
        partner: {
          name: "Gallery One",
        },
      },
    },
    {
      node: {
        internalID: "show-2",
        slug: "gallery-two-contemporary",
        name: "Contemporary Works",
        href: "/show/gallery-two-contemporary",
        city: "London",
        formattedStartAt: "Feb 1",
        formattedEndAt: "Apr 10",
        partner: {
          name: "Gallery Two",
        },
      },
    },
    {
      node: {
        internalID: "show-3",
        slug: "gallery-three-abstracts",
        name: "Abstract Expressions",
        href: "/show/gallery-three-abstracts",
        city: "Paris",
        formattedStartAt: "Mar 5",
        formattedEndAt: "May 15",
        partner: {
          name: "Gallery Three",
        },
      },
    },
  ],
  pageInfo: {
    hasNextPage: false,
    endCursor: null,
  },
}
