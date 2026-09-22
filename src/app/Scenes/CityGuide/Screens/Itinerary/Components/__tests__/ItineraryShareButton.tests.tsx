import { fireEvent, screen } from "@testing-library/react-native"
import { ItineraryShareButtonTestQuery } from "__generated__/ItineraryShareButtonTestQuery.graphql"
import { ItineraryShareButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryShareButton"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import RNShare from "react-native-share"
import { graphql } from "react-relay"

jest.mock("react-native-share", () => ({ open: jest.fn() }))

describe("ItineraryShareButton", () => {
  const { renderWithRelay } = setupTestWrapper<ItineraryShareButtonTestQuery>({
    Component: ItineraryShareButton,
    query: graphql`
      query ItineraryShareButtonTestQuery($id: String!) @relay_test_operation {
        itinerary(id: $id) {
          ...ItineraryShareButton_itinerary
        }
      }
    `,
    variables: { id: "guide-1" },
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shares a curated guide's public link", async () => {
    renderWithRelay({
      Itinerary: () => ({
        internalID: "guide-1",
        slug: "chill-vibes-only",
        citySlug: "london-united-kingdom",
        title: "Chill Vibes Only",
        isCurated: true,
        shareToken: null,
      }),
    })

    fireEvent.press(await screen.findByTestId("itinerary-share"))

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(RNShare.open).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Chill Vibes Only",
        message: expect.stringContaining(
          "https://staging.artsy.net/city-guide/london-united-kingdom/itinerary/chill-vibes-only"
        ),
      })
    )
  })

  it("renders nothing for someone else's personal itinerary", async () => {
    renderWithRelay({
      Itinerary: () => ({
        internalID: "guide-1",
        slug: null,
        citySlug: "london-united-kingdom",
        title: "Someone Else's Trip",
        isCurated: false,
        isMine: false,
        shareToken: "tok",
      }),
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(screen.queryByTestId("itinerary-share")).not.toBeOnTheScreen()
  })

  it("shares your own personal itinerary", async () => {
    renderWithRelay({
      Itinerary: () => ({
        internalID: "guide-1",
        slug: null,
        citySlug: "london-united-kingdom",
        title: "My Trip",
        isCurated: false,
        isMine: true,
        shareToken: "tok",
      }),
    })

    expect(await screen.findByTestId("itinerary-share")).toBeOnTheScreen()
  })

  it("does not extend hitSlop toward the Edit button on its left (FIREWORKS-48)", async () => {
    renderWithRelay({
      Itinerary: () => ({
        internalID: "guide-1",
        slug: "chill-vibes-only",
        citySlug: "london-united-kingdom",
        title: "Chill Vibes Only",
        isCurated: true,
        shareToken: null,
      }),
    })

    const shareButton = await screen.findByTestId("itinerary-share")

    // The Edit button sits directly to the left with only a 10pt gap (space[1]) between them.
    // A left hitSlop of 0 keeps this button's touch target from reaching into that gap.
    expect(shareButton).toHaveProp("hitSlop", expect.objectContaining({ left: 0 }))
  })
})
