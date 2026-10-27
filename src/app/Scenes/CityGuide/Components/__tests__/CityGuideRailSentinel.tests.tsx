import { ContextModule } from "@artsy/cohesion"
import { CityGuideRailSentinel } from "app/Scenes/CityGuide/Components/CityGuideRailSentinel"
import { Sentinel } from "app/utils/Sentinel"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { act } from "react"

describe("CityGuideRailSentinel", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const setVisible = (view: ReturnType<typeof renderWithWrappers>, visible: boolean) =>
    act(() => view.UNSAFE_getByType(Sentinel).props.onChange(visible))

  it("tracks railViewed once, the first time the rail is on screen", () => {
    const view = renderWithWrappers(
      <CityGuideRailSentinel contextModule={ContextModule.cityGuideGuidesRail} />
    )

    setVisible(view, false)
    expect(mockTrackEvent).not.toHaveBeenCalled()

    setVisible(view, true)

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "railViewed",
      context_module: "cityGuideGuidesRail",
      context_screen: "cityGuide",
    })
    expect(view.UNSAFE_queryByType(Sentinel)).toBeNull()
  })
})
