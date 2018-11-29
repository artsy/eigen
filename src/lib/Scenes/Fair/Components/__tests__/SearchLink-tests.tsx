import { shallow } from "enzyme"
import React from "react"
import * as renderer from "react-test-renderer"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { SearchLink } from "../SearchLink"

describe("SearchLink", () => {
  it("Renders properly", () => {
    const comp = renderer.create(<SearchLink fairID="this-is-a-fair-id" />)
    expect(comp).toMatchSnapshot()
  })

  it("Routes to Fair Search on click", () => {
    const comp = shallow(<SearchLink fairID="this-is-a-fair-id" />)
    const inst = comp.instance()

    inst.handlePress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(inst, "/this-is-a-fair-id/search")
  })
})
