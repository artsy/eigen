import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionArtnetNewsTestsQuery } from "__generated__/HomeViewSectionArtnetNewsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionArtnetNews } from "app/Scenes/HomeView/Sections/HomeViewSectionArtnetNews"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionArtnetNews", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionArtnetNewsTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionArtnetNews section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionArtnetNewsTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-artnet-news") {
            ... on HomeViewSectionArtnetNews {
              ...HomeViewSectionArtnetNews_section
            }
          }
        }
      }
    `,
  })

  it("does not render the section if no articles are available", () => {
    renderWithRelay({
      HomeViewSectionArtnetNews: () => ({
        internalID: "home-view-section-artnet-news",
        component: {
          title: "artnet News",
        },
        artnetNewsArticlesConnection: null,
      }),
    })

    expect(screen.queryByText("artnet News")).not.toBeOnTheScreen()
    expect(screen.toJSON()).toBeNull()
  })

  it("renders a list of articles", () => {
    renderWithRelay({
      HomeViewSectionArtnetNews: () => ({
        internalID: "home-view-section-artnet-news",
        contextModule: "marketNews",
        component: {
          title: "artnet News",
        },
        artnetNewsArticlesConnection: {
          edges: [
            {
              node: {
                title: "Auction Record Shattered",
                internalID: "1",
                url: "https://news.artnet.com/market/auction-record-1",
              },
            },
            {
              node: {
                title: "Museum Acquires Major Work",
                internalID: "2",
                url: "https://news.artnet.com/art-world/museum-acquires-2",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("artnet News")).toBeOnTheScreen()
    expect(screen.getByText("Auction Record Shattered")).toBeOnTheScreen()
    expect(screen.getByText("Museum Acquires Major Work")).toBeOnTheScreen()
  })

  it("tracks article taps", () => {
    renderWithRelay({
      HomeViewSectionArtnetNews: () => ({
        internalID: "home-view-section-artnet-news",
        contextModule: "marketNews",
        component: {
          title: "artnet News",
        },
        artnetNewsArticlesConnection: {
          edges: [
            {
              node: {
                title: "Auction Record Shattered",
                internalID: "artnet-article-1",
                url: "https://news.artnet.com/market/auction-record-1",
              },
            },
            {
              node: {
                title: "Museum Acquires Major Work",
                internalID: "artnet-article-2",
                url: "https://news.artnet.com/art-world/museum-acquires-2",
              },
            },
          ],
        },
      }),
    })

    fireEvent.press(screen.getByText("Museum Acquires Major Work"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArticleGroup",
      context_module: "marketNews",
      context_screen_owner_type: "home",
      destination_screen_owner_id: "artnet-article-2",
      destination_screen_owner_slug: undefined,
      destination_screen_owner_type: "article",
      horizontal_slide_position: 1,
      module_height: "double",
      type: "thumbnail",
    })
  })

  it("tracks view-all navigation", () => {
    renderWithRelay({
      HomeViewSectionArtnetNews: () => ({
        internalID: "home-view-section-artnet-news",
        contextModule: "marketNews",
        component: {
          title: "artnet News",
          behaviors: {
            viewAll: {
              ownerType: "articles",
              href: "https://news.artnet.com",
            },
          },
        },
        artnetNewsArticlesConnection: {
          edges: [
            {
              node: {
                title: "Auction Record Shattered",
                internalID: "artnet-article-1",
                url: "https://news.artnet.com/market/auction-record-1",
              },
            },
          ],
        },
      }),
    })

    fireEvent.press(screen.getByText("artnet News"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArticleGroup",
      context_module: "marketNews",
      context_screen_owner_type: "home",
      destination_screen_owner_type: "articles",
      type: "viewAll",
    })
  })
})
