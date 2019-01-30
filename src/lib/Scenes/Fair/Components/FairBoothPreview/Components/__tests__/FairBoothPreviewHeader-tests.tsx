import { Theme } from "@artsy/palette"
import { shallow } from "enzyme"
import { FairBooth } from "lib/Scenes/Fair/Screens/FairBooth"
import React from "react"
import { FairBoothPreviewHeader } from "../FairBoothPreviewHeader"

describe("FairBoothPreviewHeader", () => {
  it("renders properly", () => {
    const wrapper = shallow(
      <Theme>
        <FairBoothPreviewHeader
          name="A Partner"
          location="Booth 21"
          url="http://placehold.it/200x200"
          onViewFairBoothPressed={jest.fn()}
        />
      </Theme>
    )
    expect(wrapper.html()).toMatchSnapshot()
  })
})
