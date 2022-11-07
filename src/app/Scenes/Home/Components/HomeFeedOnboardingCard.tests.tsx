import { fireEvent, render } from "@testing-library/react-native"
import { navigate, switchTab } from "app/navigation/navigate"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL, renderWithWrappers } from "app/tests/renderWithWrappers"
import "react-native"
import { HomeFeedOnboardingCard } from "./HomeFeedOnboardingCard"
import { HomeFeedOnboardingRailItemProps } from "./HomeFeedOnboardingRail"

describe("HomeFeedOnboardingCard", () => {
  it("renders without throwing an error", () => {
    const { getByText } = renderWithWrappers(<HomeFeedOnboardingCard item={mockItem} />)

    expect(getByText("Sell with Artsy")).toBeTruthy()
  })

  it("does not render when should show is false", () => {
    const { queryAllByText } = renderWithWrappers(
      <HomeFeedOnboardingCard item={mockItemNotShown} />
    )

    expect(queryAllByText("Sell with Artsy")).toHaveLength(0)
  })

  it("button works", async () => {
    const { getByText } = renderWithWrappers(<HomeFeedOnboardingCard item={mockItem} />)
    fireEvent.press(getByText("Learn more"))
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
  type: "SWA",
  title: "Sell with Artsy ",
  subtitle: "Get the best sales options for artworks from your collection.",
  image: require("images/homefeed-my-collection-inboarding-1.webp"),
  button: "Learn more",
}
