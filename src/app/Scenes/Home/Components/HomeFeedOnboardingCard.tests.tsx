import { fireEvent } from "@testing-library/react-native"
import { navigate, switchTab } from "app/navigation/navigate"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import "react-native"
import { HomeFeedOnboardingCard } from "./HomeFeedOnboardingCard"
import { HomeFeedOnboardingRailItemProps } from "./HomeFeedOnboardingRail"

describe("HomeFeedOnboardingCard", () => {
  it("renders without throwing an error", () => {
    const { getByText } = renderWithWrappers(<HomeFeedOnboardingCard item={mockItemSell} />)

    expect(getByText(mockItemSell.title)).toBeTruthy()
  })

  it("sell card's button works", async () => {
    const { getByText } = renderWithWrappers(<HomeFeedOnboardingCard item={mockItemSell} />)
    fireEvent.press(getByText(mockItemSell.button))
    expect(switchTab).toHaveBeenCalledWith("sell")
  })

  it("MyC card's button works", async () => {
    const { getByText } = renderWithWrappers(<HomeFeedOnboardingCard item={mockItemMyC} />)
    fireEvent.press(getByText(mockItemMyC.button))
    expect(navigate).toHaveBeenCalledWith("/")
  })
})

const mockItemSell: HomeFeedOnboardingRailItemProps = {
  shouldShow: true,
  type: "SWA",
  title: "Sell with Artsy ",
  subtitle: "Get the best sales options for artworks from your collection.",
  image: require("images/homefeed-my-collection-inboarding-1.webp"),
  button: "Learn more",
}

const mockItemMyC: HomeFeedOnboardingRailItemProps = {
  shouldShow: true,
  type: "MyC",
  title: "Manage your collection",
  subtitle: "Get powerful market insights about artworks you own.",
  image: require("images/homefeed-my-collection-inboarding-0.webp"),
  button: "Explore My Collection",
}
