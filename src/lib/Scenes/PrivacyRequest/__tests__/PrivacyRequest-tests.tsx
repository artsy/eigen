import { shallow } from "enzyme"
import React from "react"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentEmailComposer: jest.fn(),
  presentModalViewController: jest.fn(),
}))

import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { Button } from "@artsy/palette"
import { LinkText } from "lib/Components/Text/LinkText"
import { PrivacyRequest } from "../PrivacyRequest"

describe(PrivacyRequest, () => {
  it("handles privacy policy link taps", () => {
    const tree = shallow(<PrivacyRequest />)

    tree
      .find(LinkText)
      .at(0)
      .simulate("press")

    expect(SwitchBoard.presentModalViewController).toHaveBeenCalledWith(expect.anything(), "/privacy")
  })

  it("handles email link taps", () => {
    const tree = shallow(<PrivacyRequest />)

    tree
      .find(LinkText)
      .at(1)
      .simulate("press")

    expect(SwitchBoard.presentEmailComposer).toHaveBeenCalledWith(
      expect.anything(),
      "privacy@artsy.net",
      "Personal Data Request"
    )
  })

  it("handles CCPA button presses", () => {
    const tree = shallow(<PrivacyRequest />)

    tree.find(Button).simulate("press")

    expect(SwitchBoard.presentEmailComposer).toHaveBeenCalledWith(
      expect.anything(),
      "privacy@artsy.net",
      "Personal Data Request"
    )
  })
})
