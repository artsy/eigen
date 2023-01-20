import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"

import DarkNavigationButton from "./DarkNavigationButton"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(
    <DarkNavigationButton title="uI am a navigation button" href="/some/path" />
  )
})

describe("routing", () => {
  it("calls the switchboard with the route", () => {
    const button = new DarkNavigationButton({ title: "any", href: "/my/url" })
    button.openLink()
    expect(navigate).toBeCalledWith("/my/url")
  })

  it("calls onPress in props, if passed instead", () => {
    const myOnPress = jest.fn() as any
    const button = new DarkNavigationButton({ title: "any", onPress: myOnPress })
    button.openLink()
    expect(myOnPress).toBeCalled()
  })
})
