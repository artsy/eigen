import { fireEvent } from "@testing-library/react-native"
import { switchTab } from "app/navigation/navigate"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import "react-native"
import { HomeFeedOnboardingCard } from "./HomeFeedOnboardingCard"
import { HomeFeedOnboardingRailItemProps } from "./HomeFeedOnboardingRail"

describe("HomeFeedOnboardingCard", () => {
  it("renders without throwing an error", () => {
    const { getByText } = renderWithWrappers(<HomeFeedOnboardingCard item={mockItem} />)

    expect(getByText(mockItem.title)).toBeTruthy()
  })

  it("button works", async () => {
    const { getByText } = renderWithWrappers(<HomeFeedOnboardingCard item={mockItem} />)
    fireEvent.press(getByText(mockItem.button))
    expect(switchTab).toHaveBeenCalledWith("sell")
  })
})

const mockItem: HomeFeedOnboardingRailItemProps = {
  shouldShow: true,
  type: "SWA",
  title: "Sell with Artsy ",
  subtitle: "Get the best sales options for artworks from your collection.",
  image: require("images/homefeed-my-collection-inboarding-1.webp"),
  button: "Learn more",
}
