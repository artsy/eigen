import { OwnerType } from "@artsy/cohesion"
import { PortalHost } from "@gorhom/portal"
import { fireEvent, screen } from "@testing-library/react-native"
import { GlobalSearchInputOverlay } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlay"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/system/flags/hooks/useExperimentFlag", () => ({
  useExperimentFlag: jest.fn(),
}))

jest.mock("app/utils/hooks/useSelectedTab", () => ({
  useSelectedTab: jest.fn().mockReturnValue("home"),
}))

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

const renderOverlay = (props: { hideModal?: () => void } = {}) =>
  renderWithWrappers(
    <>
      <PortalHost name={`${OwnerType.home}-SearchOverlay`} />
      <GlobalSearchInputOverlay
        ownerType={OwnerType.home}
        visible
        hideModal={props.hideModal ?? jest.fn()}
      />
    </>,
    { includeNavigation: true }
  )

describe("GlobalSearchInputOverlay — Search by photo entry point", () => {
  const mockUseExperimentFlag = useExperimentFlag as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the Search by photo button when onyx_artsy-lens is on", () => {
    mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")

    renderOverlay()

    expect(screen.getByTestId("search-by-photo-button")).toBeOnTheScreen()
  })

  it("hides the Search by photo button when onyx_artsy-lens is off", () => {
    mockUseExperimentFlag.mockReturnValue(false)

    renderOverlay()

    expect(screen.queryByTestId("search-by-photo-button")).not.toBeOnTheScreen()
  })

  it("dismisses the overlay and navigates to /lens on press", () => {
    mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")
    const hideModal = jest.fn()

    renderOverlay({ hideModal })

    fireEvent.press(screen.getByTestId("search-by-photo-button"))

    expect(hideModal).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith("/lens")
  })
})
