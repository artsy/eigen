import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { navigate } from "app/navigation/navigate"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { shallow } from "enzyme"
import { Button, LinkText } from "palette"
import React from "react"
import { PrivacyRequest } from "./PrivacyRequest"

describe(PrivacyRequest, () => {
  it("handles privacy policy link taps", () => {
    const tree = shallow(<PrivacyRequest />)

    tree.find(LinkText).at(0).simulate("press")

    expect(navigate).toHaveBeenCalledWith("/privacy", { modal: true })
  })

  it("handles email link taps", () => {
    const tree = shallow(<PrivacyRequest />)

    tree.find(LinkText).at(1).simulate("press")

    expect(
      LegacyNativeModules.ARTNativeScreenPresenterModule.presentEmailComposerWithSubject
    ).toHaveBeenCalledWith("Personal Data Request", "privacy@artsy.net")
  })

  it("handles CCPA button presses", () => {
    const tree = shallow(<PrivacyRequest />)

    tree.find(Button).simulate("press")

    expect(
      LegacyNativeModules.ARTNativeScreenPresenterModule.presentEmailComposerWithBody
    ).toHaveBeenCalledWith(
      "Hello, I'm contacting you to ask that...",
      "Personal Data Request",
      "privacy@artsy.net"
    )
  })
})
