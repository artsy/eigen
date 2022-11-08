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

  it("does not render when should show is false", () => {
    const { queryAllByText } = renderWithWrappers(
      <HomeFeedOnboardingCard item={mockItemNotShown} />
    )

    expect(queryAllByText(mockItemNotShown.title)).toHaveLength(0)
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

const mockItemNotShown: HomeFeedOnboardingRailItemProps = {
  shouldShow: false,
  type: "MyC",
  title: "Manage your collection",
  subtitle: "Get powerful market insights about artworks you own.",
  image: require("images/homefeed-my-collection-inboarding-0.webp"),
  button: "Explore My Collection",
}
