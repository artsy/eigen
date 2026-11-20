import { ContextModule } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideRailSentinel } from "app/Scenes/CityGuide/Components/CityGuideRailSentinel"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/Sentinel", () => {
  const { View } = require("react-native")

  return {
    __esModule: true,
    Sentinel: (props: any) => <View testID="rail-sentinel" {...props} />,
  }
})

describe("CityGuideRailSentinel", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const setVisible = (visible: boolean) =>
    fireEvent(screen.getByTestId("rail-sentinel"), "change", visible)

  it("tracks railViewed once, the first time the rail is on screen", async () => {
    await renderWithWrappers(
      <CityGuideRailSentinel contextModule={ContextModule.cityGuideGuidesRail} />
    )

    await setVisible(false)
    expect(mockTrackEvent).not.toHaveBeenCalled()

    await setVisible(true)

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "railViewed",
      context_module: "cityGuideGuidesRail",
      context_screen: "cityGuide",
    })
    expect(screen.queryByTestId("rail-sentinel")).not.toBeOnTheScreen()
  })
})
