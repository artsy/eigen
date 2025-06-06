import { fireEvent, screen } from "@testing-library/react-native"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { ActivateMoreMarketInsightsBanner } from "app/Scenes/MyCollection/Screens/Insights/ActivateMoreMarketInsightsBanner"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("MyCollectionInsights banner", () => {
  const TestRenderer = () => {
    return <ActivateMoreMarketInsightsBanner />
  }

  it("renders", async () => {
    renderWithWrappers(<TestRenderer />)

    expect(await screen.findByText("Unlock More Insights")).toBeTruthy()
  })

  it("navigates to MyCollectionArtworkForm when Upload Another Artwork is pressed", () => {
    renderWithWrappers(<TestRenderer />)

    fireEvent.press(screen.getByTestId("activate-more-market-insights-banner"))
    expect(navigate).toHaveBeenCalledWith(
      "my-collection/artworks/new",
      expect.objectContaining({
        passProps: { source: Tab.insights },
      })
    )
  })
})
