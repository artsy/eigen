import AsyncStorage from "@react-native-async-storage/async-storage"
import { screen, waitFor } from "@testing-library/react-native"
import { ItineraryHeaderTestsQuery } from "__generated__/ItineraryHeaderTestsQuery.graphql"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { storeLocalImage } from "app/utils/LocalImageStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// The real Image passes `src` to FastImage as `source.uri`, so swap in RN's Image to assert on it.
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

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

  it("shows a cover just saved on this device over the server's old one", async () => {
    await storeLocalImage("itinerary-cover-itinerary-1", {
      path: "file:///photo.jpg",
      width: 1200,
      height: 800,
    })

    renderWithRelay({
      Itinerary: () => ({
        internalID: "itinerary-1",
        isCurated: false,
        heroImage: { url: "https://example.com/old.jpg" },
      }),
    })

    await waitFor(() =>
      expect(screen.getByTestId("itinerary-hero-image")).toHaveProp("src", "file:///photo.jpg")
    )

    await AsyncStorage.clear()
  })
})
