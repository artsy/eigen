import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { GlobalSearchInput } from "app/Components/GlobalSearchInput/GlobalSearchInput"
import { useSelectedTab } from "app/utils/hooks/useSelectedTab"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/hooks/useSelectedTab", () => ({
  useSelectedTab: jest.fn(),
}))

jest.mock("app/Components/GlobalSearchInput/utils/useDismissSearchOverlayOnTabBarPress", () => ({
  useDismissSearchOverlayOnTabBarPress: jest.fn(),
}))

describe("GlobalSearchInput", () => {
  const mockUseledTab = useSelectedTab as jest.Mock

  beforeEach(() => {
    mockUseledTab.mockReturnValue("home")
  })

  it("renders the search label properly", () => {
    renderWithWrappers(<GlobalSearchInput ownerType={OwnerType.home} />)

    expect(/Search Artsy/).toBeTruthy()
  })

  it("tracks the search bar tapped event", () => {
    renderWithWrappers(<GlobalSearchInput ownerType={OwnerType.home} />)

    fireEvent.press(screen.getByTestId("search-button"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedGlobalSearchBar",
        context_screen_owner_type: "home",
      })
    )
  })
})
