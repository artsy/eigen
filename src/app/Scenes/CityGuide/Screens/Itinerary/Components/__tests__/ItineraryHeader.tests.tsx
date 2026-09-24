import AsyncStorage from "@react-native-async-storage/async-storage"
import { screen, waitFor } from "@testing-library/react-native"
import { ItineraryHeaderTestsQuery } from "__generated__/ItineraryHeaderTestsQuery.graphql"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { storeLocalImage } from "app/utils/LocalImageStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// Plain RN Image, so tests can assert on `src` rather than FastImage's Gemini-resized `uri`.
jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Image: require("react-native").Image,
}))

describe("ItineraryHeader", () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

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

  describe("after a new cover is saved", () => {
    const oldCover = {
      internalID: "itinerary-1",
      title: "London Oct 2026",
      isCurated: false,
      heroImage: {
        url: "https://example.com/old-cover.jpg",
        aspectRatio: 0.5,
        blurhash: "old-blurhash",
      },
    }

    // Gravity builds the new cover's versions in the background, so a refetch soon after
    // saving still returns the old one.
    it("shows the saved local photo while the server still returns the old cover", async () => {
      await storeLocalImage("itinerary-cover-itinerary-1", {
        path: "file:///local-cover.jpg",
        width: 1200,
        height: 800,
      })

      renderWithRelay({ Itinerary: () => oldCover })

      await waitFor(() =>
        expect(screen.getByTestId("itinerary-hero-image")).toHaveProp(
          "src",
          "file:///local-cover.jpg"
        )
      )
      expect(screen.getByTestId("itinerary-hero-image")).toHaveProp("performResize", false)
      expect(screen.getByTestId("itinerary-hero-image")).toHaveProp("blurhash", null)
    })

    it("shows the saved local photo when the server has no cover yet", async () => {
      await storeLocalImage("itinerary-cover-itinerary-1", { path: "file:///local-cover.jpg" })

      renderWithRelay({ Itinerary: () => ({ ...oldCover, heroImage: null }) })

      await waitFor(() =>
        expect(screen.getByTestId("itinerary-hero-image")).toHaveProp(
          "src",
          "file:///local-cover.jpg"
        )
      )
    })

    it("shows the server's cover once the local photo has expired", async () => {
      await AsyncStorage.setItem(
        "IMAGES_itinerary-cover-itinerary-1",
        JSON.stringify({ path: "file:///local-cover.jpg", expires: `${Date.now() - 1000}` })
      )

      renderWithRelay({ Itinerary: () => oldCover })

      // Let the stored entry be read before asserting it was ignored.
      await new Promise(process.nextTick)

      expect(screen.getByTestId("itinerary-hero-image")).toHaveProp(
        "src",
        "https://example.com/old-cover.jpg"
      )
      expect(screen.getByTestId("itinerary-hero-image")).toHaveProp("performResize", true)
    })
  })
})
