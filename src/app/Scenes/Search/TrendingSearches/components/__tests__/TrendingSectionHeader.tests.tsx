import { fireEvent, screen } from "@testing-library/react-native"
import { TrendingSectionHeader } from "app/Scenes/Search/TrendingSearches/components/TrendingSectionHeader"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("TrendingSectionHeader", () => {
  it("renders the title", () => {
    renderWithWrappers(<TrendingSectionHeader title="Trending Artists" />)

    expect(screen.getByText("Trending Artists")).toBeOnTheScreen()
  })

  it("does not render the action when no callback is provided", () => {
    renderWithWrappers(<TrendingSectionHeader title="Trending Artists" actionLabel="Clear" />)

    expect(screen.queryByText("Clear")).not.toBeOnTheScreen()
  })

  it("renders the action and fires the callback when tapped", () => {
    const onActionPress = jest.fn()
    renderWithWrappers(
      <TrendingSectionHeader
        title="Recent Searches"
        actionLabel="Clear"
        onActionPress={onActionPress}
      />
    )

    fireEvent.press(screen.getByText("Clear"))
    expect(onActionPress).toHaveBeenCalledTimes(1)
  })
})
