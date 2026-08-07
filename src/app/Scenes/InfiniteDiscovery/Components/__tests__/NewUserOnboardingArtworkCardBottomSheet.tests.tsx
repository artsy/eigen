import { handleOnboardingArtworkSheetBack } from "app/Scenes/InfiniteDiscovery/Components/NewUserOnboardingArtworkCardBottomSheet"

describe("handleOnboardingArtworkSheetBack", () => {
  it("collapses the sheet (and does not background) when expanded", () => {
    const collapse = jest.fn()
    const background = jest.fn()

    const handled = handleOnboardingArtworkSheetBack({ isExpanded: true, collapse, background })

    expect(collapse).toHaveBeenCalledTimes(1)
    expect(background).not.toHaveBeenCalled()
    // returns true so the native stack doesn't pop back to the previous onboarding step
    expect(handled).toBe(true)
  })

  it("backgrounds the app (and does not collapse) when already collapsed", () => {
    const collapse = jest.fn()
    const background = jest.fn()

    const handled = handleOnboardingArtworkSheetBack({ isExpanded: false, collapse, background })

    expect(background).toHaveBeenCalledTimes(1)
    expect(collapse).not.toHaveBeenCalled()
    expect(handled).toBe(true)
  })
})
