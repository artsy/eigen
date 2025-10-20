import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionCardsTestsQuery } from "__generated__/HomeViewSectionCardsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionCards } from "app/Scenes/HomeView/Sections/HomeViewSectionCards"
import { navigate } from "app/system/navigation/navigate"
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
        ...component,
        ...cardsConnection,
      }),
    })

    fireEvent.press(screen.getByText("Section Title"))
    // TODO: test tracking
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
    // TODO: test tracking
    expect(navigate).toHaveBeenCalledWith("/0-route")

    fireEvent.press(screen.getByText("Card Title 1"))
    // TODO: test tracking
    expect(navigate).toHaveBeenCalledWith("/1-route")

    fireEvent.press(screen.getByText("Card Title 2"))
    // TODO: test tracking
    expect(navigate).toHaveBeenCalledWith("/2-route")
  })
})

const component = {
  component: {
    title: "Section Title",
    behaviors: {
      viewAll: {
        href: "/view-all-route",
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
