import { fireEvent, screen } from "@testing-library/react-native"
import { FeaturedFairsScreen } from "app/Scenes/Fair/FeaturedFairsScreen"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { useTracking } from "react-tracking"

describe("FeaturedFairsScreen", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <FeaturedFairsScreen />,
  })

  it("renders fairs", async () => {
    await renderWithRelay({
      Query: () => ({
        viewer: {
          featuredFairs: mockFairsData,
        },
      }),
    })

    expect(screen.queryByTestId("featured-fairs-screen-placeholder")).not.toBeOnTheScreen()

    expect(screen.getByText("Art Saloon International")).toBeTruthy()
    expect(screen.getByText("Art Saloon II")).toBeTruthy()
  })

  it("opens fair screen and tracks on press", async () => {
    await renderWithRelay({
      Query: () => ({
        viewer: {
          featuredFairs: mockFairsData,
        },
      }),
    })

    expect(screen.queryByTestId("featured-fairs-screen-placeholder")).not.toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Art Saloon International"))

    expect(useTracking().trackEvent).toHaveBeenCalledWith({
      action: "tappedFairGroup",
      context_module: "fairCard",
      context_screen_owner_type: "fairs",
      destination_screen_owner_id: "art-saloon-international",
      destination_screen_owner_slug: '<mock-value-for-field-"slug">',
      destination_screen_owner_type: "fair",
    })

    expect(navigate).toHaveBeenCalledWith('/fair/<mock-value-for-field-"slug">')
  })
})

const mockFairsData = [
  { internalID: "art-saloon-international", name: "Art Saloon International" },
  {
    internalID: "art-saloon-ii",
    name: "Art Saloon II",
  },
]
