import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { HomeViewSectionCityGuidesTestsQuery } from "__generated__/HomeViewSectionCityGuidesTestsQuery.graphql"
import { getNearestCityGuideHref } from "app/Scenes/HomeView/Components/CityGuides/getNearestCityGuideHref"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionCityGuides } from "app/Scenes/HomeView/Sections/HomeViewSectionCityGuides"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/utils/hooks/withSuspense")
jest.mock("app/Scenes/HomeView/Components/CityGuides/getNearestCityGuideHref", () => ({
  getNearestCityGuideHref: jest.fn(),
}))

const mockGetNearestCityGuideHref = getNearestCityGuideHref as jest.Mock

describe("HomeViewSectionCityGuides", () => {
  beforeEach(() => {
    ;(navigate as jest.Mock).mockClear()
    mockTrackEvent.mockClear()
    mockGetNearestCityGuideHref.mockReset()
  })

  const { renderWithRelay } = setupTestWrapper<HomeViewSectionCityGuidesTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }

      return (
        <HomeViewStoreProvider>
          <HomeViewSectionCityGuides section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionCityGuidesTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-city-guides") {
            ... on HomeViewSectionCityGuides {
              ...HomeViewSectionCityGuides_section
            }
          }
        }
      }
    `,
  })

  const section = {
    internalID: "home-view-section-city-guides",
    contextModule: "cityGuideCard",
    component: {
      title: "Discover the art that makes your city special",
      description: "Then create your own way to experience it",
      behaviors: {
        viewAll: { buttonText: "City Guide", href: "/city-guide", ownerType: null },
      },
    },
    cardsConnection: {
      edges: [
        {
          node: {
            citySlug: "london-united-kingdom",
            title: "London",
            href: "/city-guide?citySlug=london-united-kingdom",
            chips: ["6 Curated Guides", "89 Shows"],
            image: { imageURL: "https://files.artsy.net/images/london.webp" },
          },
        },
        {
          node: {
            citySlug: "new-york-ny-usa",
            title: "New York",
            href: "/city-guide?citySlug=new-york-ny-usa",
            chips: ["100+ Shows"],
            image: { imageURL: "https://files.artsy.net/images/new-york.webp" },
          },
        },
        {
          node: {
            citySlug: null,
            title: "Explore city near me",
            href: "/city-guide",
            chips: [],
            image: { imageURL: "https://files.artsy.net/images/near-me.webp" },
          },
        },
      ],
    },
  }

  it("renders the section and the centered card", () => {
    renderWithRelay({ HomeViewSectionCityGuides: () => section })

    expect(screen.getByText("Discover the art that makes your city special")).toBeOnTheScreen()
    expect(screen.getByText("Then create your own way to experience it")).toBeOnTheScreen()
    expect(screen.getByText("City Guide")).toBeOnTheScreen()

    expect(screen.getAllByText("London").length).toBeGreaterThan(0)
    expect(screen.getAllByText("6 Curated Guides").length).toBeGreaterThan(0)
    expect(screen.getAllByText("89 Shows").length).toBeGreaterThan(0)
  })

  it("renders one blurred backdrop layer per card", () => {
    renderWithRelay({ HomeViewSectionCityGuides: () => section })

    expect(screen.getAllByTestId("city-guides-backdrop-image")).toHaveLength(3)
  })

  it("opens the centered card's City Guide and tracks it", () => {
    renderWithRelay({ HomeViewSectionCityGuides: () => section })

    fireEvent.press(screen.getByLabelText("Open the London City Guide"))

    expect(navigate).toHaveBeenCalledWith("/city-guide?citySlug=london-united-kingdom")
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedCardGroup",
      context_module: "cityGuideCard",
      context_screen_owner_type: "home",
      destination_path: "/city-guide?citySlug=london-united-kingdom",
      destination_screen_owner_id: "london-united-kingdom",
      destination_screen_owner_type: "cityGuide",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })

  it("doesn't navigate when tapping a side card", () => {
    renderWithRelay({ HomeViewSectionCityGuides: () => section })

    fireEvent.press(screen.getAllByLabelText("Show New York")[0])

    expect(navigate).not.toHaveBeenCalled()
    expect(mockTrackEvent).not.toHaveBeenCalled()
  })

  it("opens the City Guide from the button and tracks it", () => {
    renderWithRelay({ HomeViewSectionCityGuides: () => section })

    fireEvent.press(screen.getByText("City Guide"))

    expect(navigate).toHaveBeenCalledWith("/city-guide")
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedCardGroup",
      context_module: "cityGuideCard",
      context_screen_owner_type: "home",
      destination_screen_owner_type: "cityGuide",
      type: "viewAll",
    })
  })

  describe("Explore city near me", () => {
    /** The near-me card sits left of the first card: tapping it once brings it to the center */
    const centerNearMeCard = () => {
      fireEvent.press(screen.getAllByLabelText("Show Explore city near me")[0])
    }

    const nearMeCard = () =>
      screen.getByLabelText("Open the City Guide for the city nearest to you")

    it("is shown regardless of location access", () => {
      renderWithRelay({ HomeViewSectionCityGuides: () => section })

      expect(screen.getAllByText("Explore city near me").length).toBeGreaterThan(0)
      expect(screen.getAllByTestId("city-guides-backdrop-image")).toHaveLength(3)
    })

    it("doesn't ask for the location until it's tapped", () => {
      renderWithRelay({ HomeViewSectionCityGuides: () => section })

      centerNearMeCard()

      expect(mockGetNearestCityGuideHref).not.toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
    })

    it("opens the nearest city's City Guide and tracks the tap", async () => {
      mockGetNearestCityGuideHref.mockResolvedValue("/city-guide?citySlug=new-york-ny-usa")
      renderWithRelay({ HomeViewSectionCityGuides: () => section })

      centerNearMeCard()
      fireEvent.press(nearMeCard())

      await waitFor(() =>
        expect(navigate).toHaveBeenCalledWith("/city-guide?citySlug=new-york-ny-usa")
      )
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(mockGetNearestCityGuideHref).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "tappedCardGroup",
          destination_path: "/city-guide",
          horizontal_slide_position: 2,
        })
      )
    })

    it("does nothing when location access isn't granted", async () => {
      mockGetNearestCityGuideHref.mockResolvedValue(null)
      renderWithRelay({ HomeViewSectionCityGuides: () => section })

      centerNearMeCard()
      fireEvent.press(nearMeCard())

      // Done locating once the spinner is gone
      await waitFor(() =>
        expect(
          screen.queryByTestId("city-guide-near-me-spinner", { includeHiddenElements: true })
        ).not.toBeOnTheScreen()
      )
      expect(mockGetNearestCityGuideHref).toHaveBeenCalledTimes(1)
      expect(navigate).not.toHaveBeenCalled()
    })

    it("shows a spinner and ignores repeated taps while it's locating", async () => {
      let resolveHref: (href: string | null) => void = () => {}
      mockGetNearestCityGuideHref.mockReturnValue(
        new Promise((resolve) => {
          resolveHref = resolve
        })
      )
      renderWithRelay({ HomeViewSectionCityGuides: () => section })

      centerNearMeCard()
      fireEvent.press(nearMeCard())

      expect(
        screen.getAllByTestId("city-guide-near-me-spinner", { includeHiddenElements: true }).length
      ).toBeGreaterThan(0)

      fireEvent.press(nearMeCard())
      expect(mockGetNearestCityGuideHref).toHaveBeenCalledTimes(1)

      await act(async () => {
        resolveHref("/city-guide")
      })

      expect(
        screen.queryByTestId("city-guide-near-me-spinner", { includeHiddenElements: true })
      ).not.toBeOnTheScreen()
      expect(navigate).toHaveBeenCalledWith("/city-guide")
    })
  })

  it("renders nothing without cards", () => {
    renderWithRelay({
      HomeViewSectionCityGuides: () => ({ ...section, cardsConnection: { edges: [] } }),
    })

    expect(
      screen.queryByText("Discover the art that makes your city special")
    ).not.toBeOnTheScreen()
  })
})
