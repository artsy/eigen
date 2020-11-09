import { NativeModules } from "react-native"
import { hideBackButtonOnScroll } from "../hideBackButtonOnScroll"

function event(
  ev: DeepPartial<Parameters<typeof hideBackButtonOnScroll>[0]>
): Parameters<typeof hideBackButtonOnScroll>[0] {
  return { target: 1, ...ev } as any
}

describe(hideBackButtonOnScroll, () => {
  beforeEach(() => {
    hideBackButtonOnScroll(event({ target: Math.random(), nativeEvent: { contentOffset: { y: 0 } } }))
    ;(NativeModules.ARScreenPresenterModule.updateShouldHideBackButton as jest.Mock).mockReset()
  })

  it("hides the back button when the user scrolls down far enough", () => {
    // get going
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 40 } } }))
    expect(NativeModules.ARScreenPresenterModule.updateShouldHideBackButton).not.toHaveBeenCalled()

    // scroll down far
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 150 } } }))
    expect(NativeModules.ARScreenPresenterModule.updateShouldHideBackButton).toHaveBeenCalledWith(true, "home")
  })

  it("shows the back button when the user scrolls back up", () => {
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 40 } } }))
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 660 } } }))
    expect(NativeModules.ARScreenPresenterModule.updateShouldHideBackButton).toHaveBeenCalledWith(true, "home")

    // need to change direction first
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 650 } } }))
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 400 } } }))
    expect(NativeModules.ARScreenPresenterModule.updateShouldHideBackButton).toHaveBeenCalledWith(false, "home")
  })

  it("always shows the back button when the user is near the top of the scroll view", () => {
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 1 } } }))
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 45 } } }))
    expect(NativeModules.ARScreenPresenterModule.updateShouldHideBackButton).toHaveBeenCalledWith(false, "home")
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 55 } } }))
    expect(NativeModules.ARScreenPresenterModule.updateShouldHideBackButton).toHaveBeenCalledWith(true, "home")
    hideBackButtonOnScroll(event({ nativeEvent: { contentOffset: { y: 45 } } }))
    expect(NativeModules.ARScreenPresenterModule.updateShouldHideBackButton).toHaveBeenCalledWith(false, "home")
  })
})
