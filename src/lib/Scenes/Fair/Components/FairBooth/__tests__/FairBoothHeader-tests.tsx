import { Theme } from "@artsy/palette"
import { shallow } from "enzyme"
import React from "react"
import { FairBoothHeader } from "../Components/FairBoothHeader"

describe("FairBoothHeader", () => {
  it("renders properly", () => {
    const wrapper = shallow(
      <Theme>
        <FairBoothHeader name="A Partner" location="Booth 21" url="http://placehold.it/200x200" />
      </Theme>
    )
    expect(wrapper.html()).toMatchSnapshot()
  })
})
