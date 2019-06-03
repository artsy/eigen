import { shallow } from "enzyme"
import React from "react"
import * as renderer from "react-test-renderer"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { SearchLink } from "../SearchLink"

import { Theme } from "@artsy/palette"

describe("SearchLink", () => {
  it("Renders properly", () => {
    const comp = renderer.create(
      <Theme>
        <SearchLink id="this-is-a-fair-id" internalID="123456" />
      </Theme>
    )
    expect(comp).toMatchSnapshot()
  })

  it("Routes to Fair Search on click", () => {
    const comp = shallow(<SearchLink id="this-is-a-fair-id" internalID="123456" />)
    const inst = comp.instance()

    inst.handlePress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(inst, "/this-is-a-fair-id/search")
  })
})
