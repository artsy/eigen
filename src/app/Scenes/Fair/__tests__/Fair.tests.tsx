import { Tabs, Text } from "@artsy/palette-mobile"
import { screen } from "@testing-library/react-native"
import { FairTestsQuery } from "__generated__/FairTestsQuery.graphql"
import { Fair } from "app/Scenes/Fair/Fair"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

jest.mock("@artsy/palette-mobile", () => {
  const palette = jest.requireActual("@artsy/palette-mobile")

  return {
    ...palette,
    Tabs: {
      ...palette.Tabs,
      TabsWithHeader: jest.fn(),
    },
  }
})

jest.mock("app/utils/queryPrefetching", () => {
  const queryPrefetching = jest.requireActual("app/utils/queryPrefetching")

  return {
    ...queryPrefetching,
    prefetchQuery: jest.fn(),
  }
})

describe("Fair", () => {
  const TabsWithHeader = Tabs.TabsWithHeader as jest.Mock
  const trackEvent = useTracking().trackEvent

  const { renderWithRelay } = setupTestWrapper<FairTestsQuery>({
    Component: ({ fair }) => <Fair fair={fair} />,
    query: graphql`
      query FairTestsQuery($fairID: String!) @relay_test_operation {
        fair(id: $fairID) @required(action: NONE) {
          ...Fair_fair
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders without throwing an error", () => {
    TabsWithHeader.mockImplementation((props) => {
      return (
        <>
          <Text>{props.title}</Text>
          {props.BelowTitleHeaderComponent()}
          {props.children}
        </>
      )
    })
    renderWithRelay()

    expect(screen.getByText("Overview")).toBeOnTheScreen()
    expect(screen.getByText("Exhibitors")).toBeOnTheScreen()
    expect(screen.getByText("Artworks")).toBeOnTheScreen()
  })

  it("defaults to the Overview tab", () => {
    TabsWithHeader.mockImplementation((props) => {
      return <Text>{props.initialTabName}</Text>
    })
    renderWithRelay()

    expect(screen.getByText("Overview")).toBeOnTheScreen()
  })

  it("opens the tab specified by initialTab", () => {
    TabsWithHeader.mockImplementation((props) => {
      return <Text>{props.initialTabName}</Text>
    })

    const { renderWithRelay: renderWithInitialTab } = setupTestWrapper<FairTestsQuery>({
      Component: ({ fair }) => <Fair fair={fair} initialTab="Artworks" />,
      query: graphql`
        query FairTestsArtworksTabQuery($fairID: String!) @relay_test_operation {
          fair(id: $fairID) @required(action: NONE) {
            ...Fair_fair
          }
        }
      `,
    })

    renderWithInitialTab()

    expect(screen.getByText("Artworks")).toBeOnTheScreen()
  })

  it("falls back to Overview when Exhibitors is requested but the fair has none", () => {
    TabsWithHeader.mockImplementation((props) => {
      return <Text>{props.initialTabName}</Text>
    })

    const { renderWithRelay: renderWithInitialTab } = setupTestWrapper<FairTestsQuery>({
      Component: ({ fair }) => <Fair fair={fair} initialTab="Exhibitors" />,
      query: graphql`
        query FairTestsExhibitorsTabQuery($fairID: String!) @relay_test_operation {
          fair(id: $fairID) @required(action: NONE) {
            ...Fair_fair
          }
        }
      `,
    })

    renderWithInitialTab({
      Fair: () => ({
        _exhibitors: { totalCount: 0 },
      }),
    })

    expect(screen.getByText("Overview")).toBeOnTheScreen()
  })

  it("tracks tap navigating to the exhibitors tab", () => {
    TabsWithHeader.mockImplementation((props) => {
      props.onTabChange?.({ tabName: "Exhibitors" })

      return (
        <>
          <Text>{props.title}</Text>
          {props.BelowTitleHeaderComponent()}
          {props.children}
        </>
      )
    })
    renderWithRelay()

    renderWithRelay({
      Fair: () => ({
        isActive: true,
        slug: "art-basel-hong-kong-2020",
        internalID: "fair1244",
        counts: {
          artworks: 100,
          partnerShows: 20,
        },
      }),
    })

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedNavigationTab",
      context_module: "artworksTab",
      context_screen_owner_type: "fair",
      context_screen_owner_slug: "art-basel-hong-kong-2020",
      context_screen_owner_id: "fair1244",
      subject: "Exhibitors",
    })
  })

  it("tracks tap navigating to the artworks tab", () => {
    TabsWithHeader.mockImplementation((props) => {
      props.onTabChange?.({ tabName: "Artworks" })

      return (
        <>
          <Text>{props.title}</Text>
          {props.BelowTitleHeaderComponent()}
          {props.children}
        </>
      )
    })

    renderWithRelay({
      Fair: () => ({
        isActive: true,
        slug: "art-basel-hong-kong-2020",
        internalID: "fair1244",
        counts: {
          artworks: 100,
          partnerShows: 20,
        },
      }),
    })

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedNavigationTab",
      context_module: "exhibitorsTab",
      context_screen_owner_type: "fair",
      context_screen_owner_slug: "art-basel-hong-kong-2020",
      context_screen_owner_id: "fair1244",
      subject: "Artworks",
    })
  })
})
