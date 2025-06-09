import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { FeaturedFairsScreen } from "app/Scenes/Fair/FeaturedFairsScreen"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { useTracking } from "react-tracking"

describe("FeaturedFairsScreen", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <FeaturedFairsScreen />,
  })

  it("renders fairs", async () => {
    renderWithRelay({
      Query: () => ({
        viewer: {
          featuredFairs: mockFairsData,
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("featured-fairs-screen-placeholder"))

    expect(screen.getByText("Art Saloon International")).toBeTruthy()
    expect(screen.getByText("Art Saloon II")).toBeTruthy()
  })

  it("opens fair screen and tracks on press", async () => {
    renderWithRelay({
      Query: () => ({
        viewer: {
          featuredFairs: mockFairsData,
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("featured-fairs-screen-placeholder"))

    fireEvent.press(screen.getByText("Art Saloon International"))

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
