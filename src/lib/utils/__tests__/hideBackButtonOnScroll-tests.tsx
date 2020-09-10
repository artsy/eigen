import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { hideBackButtonOnScroll } from "../hideBackButtonOnScroll"

function event(
  ev: DeepPartial<Parameters<typeof hideBackButtonOnScroll>[0]>
): Parameters<typeof hideBackButtonOnScroll>[0] {
  return { target: 1, ...ev } as any
}

describe(hideBackButtonOnScroll, () => {
  beforeEach(() => {
    hideBackButtonOnScroll(event({ target: Math.random(), nativeEvent: { contentOffset: { y: 0 } } }))
    ;(SwitchBoard.updateShouldHideBackButton as jest.Mock).mockReset()
  })

  it("hides the back button when the user scrolls down far enough", () => {
    // get going
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 40 } } }))
    expect(SwitchBoard.updateShouldHideBackButton).not.toHaveBeenCalled()

    // scroll down far
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 150 } } }))
    expect(SwitchBoard.updateShouldHideBackButton).toHaveBeenCalledWith(true)
  })

  it("shows the back button when the user scrolls back up", () => {
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 40 } } }))
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 660 } } }))
    expect(SwitchBoard.updateShouldHideBackButton).toHaveBeenCalledWith(true)

    // need to change direction first
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 650 } } }))
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 400 } } }))
    expect(SwitchBoard.updateShouldHideBackButton).toHaveBeenCalledWith(false)
  })

  it("always shows the back button when the user is near the top of the scroll view", () => {
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 1 } } }))
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 45 } } }))
    expect(SwitchBoard.updateShouldHideBackButton).toHaveBeenCalledWith(false)
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 55 } } }))
    expect(SwitchBoard.updateShouldHideBackButton).toHaveBeenCalledWith(true)
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 45 } } }))
    expect(SwitchBoard.updateShouldHideBackButton).toHaveBeenCalledWith(false)
  })
})
