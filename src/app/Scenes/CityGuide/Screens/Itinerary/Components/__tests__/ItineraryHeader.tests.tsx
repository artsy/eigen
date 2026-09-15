import { screen } from "@testing-library/react-native"
import { ItineraryHeaderTestsQuery } from "__generated__/ItineraryHeaderTestsQuery.graphql"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ItineraryHeader", () => {
  const { renderWithRelay } = setupTestWrapper<ItineraryHeaderTestsQuery>({
    Component: (props) => <ItineraryHeader itinerary={props.itinerary!} topInset={90} />,
    query: graphql`
      query ItineraryHeaderTestsQuery @relay_test_operation {
        itinerary(id: "chill-vibes-only") {
          ...ItineraryHeader_itinerary
        }
      }
    `,
  })

  it("renders the title, subtitle, author and description", () => {
    renderWithRelay({
      Itinerary: () => ({
        title: "Chill Vibes Only",
        subtitle: "Top picks",
        authorName: "Casey Lesser",
        description: "Our list of recommendations.",
        isCurated: true,
      }),
    })

    expect(screen.getByText("Chill Vibes Only")).toBeTruthy()
    expect(screen.getByText("Top picks")).toBeTruthy()
    expect(screen.getByText("By Casey Lesser")).toBeTruthy()
    expect(screen.getByText("Our list of recommendations.")).toBeTruthy()
  })

  it("renders a scrim behind the hero text", () => {
    renderWithRelay({
      Itinerary: () => ({
        title: "Chill Vibes Only",
        isCurated: true,
        heroImage: { url: "https://example.com/hero.jpg" },
      }),
    })

    expect(screen.getByTestId("itinerary-hero-scrim")).toBeTruthy()
  })

  // With no hero image, the title has nothing else pushing it below the floating back
  // button (ItineraryScreen.tsx), which is absolutely positioned outside the scroll view.
  it("clears the floating back button with no hero image", () => {
    renderWithRelay({
      Itinerary: () => ({ title: "Chill Vibes Only", isCurated: true, heroImage: null }),
    })

    expect(screen.getByTestId("itinerary-header-no-image")).toHaveStyle({ paddingTop: 90 })
  })
})
