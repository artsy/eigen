import { fireEvent, screen } from "@testing-library/react-native"
import { FairOverviewTestsQuery } from "__generated__/FairOverviewTestsQuery.graphql"
import { FairOverview } from "app/Scenes/Fair/FairOverview"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("FairOverview", () => {
  const { renderWithRelay } = setupTestWrapper<FairOverviewTestsQuery>({
    Component: ({ fair }) => <FairOverview fair={fair} />,
    query: graphql`
      query FairOverviewTestsQuery @relay_test_operation {
        fair(id: "example") @required(action: NONE) {
          ...FairOverview_fair
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText(/mock-value-for-field-"summary"/)).toBeOnTheScreen()
    expect(screen.getByText("More info")).toBeOnTheScreen()
  })

  it("renders the necessary components when fair is active", () => {
    renderWithRelay({
      Fair: () => ({
        isActive: true,
        summary: "The biggest art fair in Hong Kong",
        counts: {
          artworks: 42,
          partnerShows: 42,
        },
        marketingCollections: [{ title: "collection-1" }],
      }),
    })

    expect(screen.getByText("The biggest art fair in Hong Kong")).toBeOnTheScreen()
    expect(screen.getByText("View all")).toBeOnTheScreen()
    expect(screen.getByText("collection-1")).toBeOnTheScreen()
    expect(screen.getByText("Works by Artists You Follow")).toBeOnTheScreen()
  })

  it("renders the About when Summary isn't available", () => {
    renderWithRelay({
      Fair: () => ({
        about: "A great place to buy art",
        summary: "",
      }),
    })

    expect(screen.getByText("A great place to buy art")).toBeOnTheScreen()
  })

  it("renders empty state given no data", () => {
    renderWithRelay({
      Fair: () => ({
        summary: null,
        about: null,
        articles: { edges: [] },
        marketingCollections: [],
        filterArtworksConnection: { edges: [] },
        counts: {
          artworks: 0,
          partnerShows: 0,
        },
      }),
    })

    expect(screen.queryByText("View all")).not.toBeOnTheScreen()
    expect(screen.queryByText("collection-1")).not.toBeOnTheScreen()
    expect(screen.queryByText("Works by Artists You Follow")).not.toBeOnTheScreen()
  })

  it("doest not render the artists you follow rail if there is no artwork", () => {
    renderWithRelay({
      Fair: () => ({
        isActive: true,
        filterArtworksConnection: {
          edges: [],
        },
      }),
    })

    expect(screen.queryByText("Works by Artists You Follow")).not.toBeOnTheScreen()
  })

  it("navigates to the fair info page on press of More Info", () => {
    renderWithRelay({
      Fair: () => ({
        slug: "art-basel-hong-kong-2020",
      }),
    })

    fireEvent.press(screen.getByText("More info"))
    expect(navigate).toHaveBeenCalledWith("/fair/art-basel-hong-kong-2020/info")
  })

  it("does not show the More Info link if there is no info to show", () => {
    renderWithRelay({
      Fair: () => ({
        about: "",
        contact: "",
        hours: "",
        links: "",
        tickets: "",
        location: {
          summary: "",
          coordinates: null,
        },
        summary: "",
        tagline: "",
        ticketsLink: "",
      }),
    })

    expect(screen.queryByText("More info")).not.toBeOnTheScreen()
  })
})
