import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { CommercialEditionSetInformation } from "../CommercialEditionSetInformation"

const artwork = {
  editionSets: [
    {
      id: "RWRpdGlvblNldDo1YmJiOTc3N2NlMmZjMzAwMmMxNzkwMTM=",
      internalID: "5bbb9777ce2fc3002c179013",
      isAcquireable: true,
      isOfferable: true,
      saleMessage: "$1",
      edition_of: "",
      dimensions: {
        in: "2 × 2 in",
        cm: "5.1 × 5.1 cm",
      },
    },
    {
      id: "RWRpdGlvblNldDo1YmMwZWMwMDdlNjQzMDBhMzliMjNkYTQ=",
      internalID: "5bc0ec007e64300a39b23da4",
      isAcquireable: true,
      isOfferable: true,
      saleMessage: "$2",
      edition_of: "",
      dimensions: {
        in: "1 × 1 in",
        cm: "2.5 × 2.5 cm",
      },
    },
  ],
}

describe("CommercialEditionSetInformation", () => {
  it("changes displays first edition price", () => {
    const component = mount(
      <Theme>
        <CommercialEditionSetInformation setEditionSetId={() => null} artwork={artwork as any} />
      </Theme>
    )

    expect(component.html()).toContain("$1")
  })

  it("changes display price to selected edition set", () => {
    const component = mount(
      <Theme>
        <CommercialEditionSetInformation setEditionSetId={() => null} artwork={artwork as any} />
      </Theme>
    )

    const secondEditionSelect = component.find(TouchableWithoutFeedback).at(1)
    secondEditionSelect.props().onPress()
    expect(component.html()).toContain("$2")
  })
})
