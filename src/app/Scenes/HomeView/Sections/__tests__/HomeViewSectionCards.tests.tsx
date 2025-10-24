import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionCardsTestsQuery } from "__generated__/HomeViewSectionCardsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionCards } from "app/Scenes/HomeView/Sections/HomeViewSectionCards"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/utils/hooks/withSuspense")

describe("HomeViewSectionCards", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionCardsTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }

      return (
        <HomeViewStoreProvider>
          <HomeViewSectionCards section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionCardsTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-auctions-hub") {
            ... on HomeViewSectionCards {
              ...HomeViewSectionCards_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    renderWithRelay({
      HomeViewSectionCards: () => ({
        internalID: "home-view-section-auctions-hub",
        ...cardsConnection,
        ...component,
      }),
    })

    expect(screen.getByText("Section Title")).toBeOnTheScreen()

    expect(screen.getByText("Card Title 0")).toBeOnTheScreen()
    expect(screen.getByText("Card Title 1")).toBeOnTheScreen()
    expect(screen.getByText("Card Title 2")).toBeOnTheScreen()
  })

  it("handles View All press", async () => {
    renderWithRelay({
      HomeViewSectionCards: () => ({
        internalID: "home-view-section-auctions-hub",
        contextModule: "auctionsHubRail",
        ...component,
        ...cardsConnection,
      }),
    })

    fireEvent.press(screen.getByText("Section Title"))
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedCardGroup",
      context_module: "auctionsHubRail",
      context_screen_owner_type: "home",
      destination_screen_owner_type: "auctions",
      type: "viewAll",
    })

    expect(navigate).toHaveBeenCalledWith("/view-all-route")
  })

  it("handles navigation when tapping on a card", async () => {
    renderWithRelay({
      HomeViewSectionCards: () => ({
        internalID: "home-view-section-auctions-hub",
        ...component,
        ...cardsConnection,
      }),
    })

    fireEvent.press(screen.getByText("Card Title 0"))
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedCardGroup",
      context_module: "lotsForYouCard",
      context_screen_owner_type: "home",
      destination_path: "/0-route",
      destination_screen_owner_id: "card-0-id",
      destination_screen_owner_type: "lotsForYou",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
    expect(navigate).toHaveBeenCalledWith("/0-route")

    fireEvent.press(screen.getByText("Card Title 1"))
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedCardGroup",
      context_module: "auctionResultsForArtistsYouFollowCard",
      context_screen_owner_type: "home",
      destination_path: "/1-route",
      destination_screen_owner_id: "card-1-id",
      destination_screen_owner_type: "auctionResultsForArtistsYouFollow",
      horizontal_slide_position: 1,
      type: "thumbnail",
    })
    expect(navigate).toHaveBeenCalledWith("/1-route")

    fireEvent.press(screen.getByText("Card Title 2"))
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedCardGroup",
      context_module: "auctionsCard",
      context_screen_owner_type: "home",
      destination_path: "/2-route",
      destination_screen_owner_id: "card-2-id",
      destination_screen_owner_type: "auctions",
      horizontal_slide_position: 2,
      type: "thumbnail",
    })
    expect(navigate).toHaveBeenCalledWith("/2-route")
  })
})

const component = {
  component: {
    title: "Section Title",
    behaviors: {
      viewAll: {
        href: "/view-all-route",
        ownerType: "auctions",
      },
    },
  },
}

const cardsConnection = {
  cardsConnection: {
    edges: [
      {
        node: {
          title: "Card Title 0",
          href: "/0-route",
          entityID: "card-0-id",
          entityType: "lotsForYou",
          contextModule: "lotsForYouCard",
          images: [
            {
              imageURL: "https://url.com/image.jpg",
            },
            {
              imageURL: "https://url.com/image2.jpg",
            },
            {
              imageURL: "https://url.com/image3.jpg",
            },
          ],
        },
      },
      {
        node: {
          title: "Card Title 1",
          href: "/1-route",
          entityID: "card-1-id",
          entityType: "auctionResultsForArtistsYouFollow",
          contextModule: "auctionResultsForArtistsYouFollowCard",
          images: [
            {
              imageURL: "https://url.com/image.jpg",
            },
            {
              imageURL: "https://url.com/image2.jpg",
            },
          ],
        },
      },
      {
        node: {
          title: "Card Title 2",
          href: "/2-route",
          entityID: "card-2-id",
          entityType: "auctions",
          contextModule: "auctionsCard",
          images: [
            {
              imageURL: "https://url.com/image.jpg",
            },
          ],
        },
      },
    ],
  },
}
