import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { DecreaseIcon, IncreaseIcon, Text } from "palette"
import React from "react"
import { AuctionResultsMidEstimate } from "./AuctionResultMidEstimate"

describe("AuctionResultMidEstimate", () => {
  it("renders properly when the percentage is greater than 5", () => {
    const tree = renderWithWrappers(
      <AuctionResultsMidEstimate value="25%" shortDescription="mid-estimate" />
    )
    expect(tree.root.findAllByType(IncreaseIcon).length).toEqual(1)
    expect(tree.root.findAllByType(Text)[0].props.color).toEqual("green100")
  })

  it("renders properly when the percentage is less than -5", () => {
    const tree = renderWithWrappers(
      <AuctionResultsMidEstimate value="-25%" shortDescription="mid-estimate" />
    )
    expect(tree.root.findAllByType(DecreaseIcon).length).toEqual(1)
    expect(tree.root.findAllByType(Text)[0].props.color).toEqual("red100")
  })

  it("renders properly when the percentage is between -5 and 5", () => {
    const instance1 = renderWithWrappers(
      <AuctionResultsMidEstimate value="2%" shortDescription="mid-estimate" />
    )
    const instance2 = renderWithWrappers(
      <AuctionResultsMidEstimate value="2%" shortDescription="mid-estimate" />
    )
    const instance3 = renderWithWrappers(
      <AuctionResultsMidEstimate value="-2%" shortDescription="mid-estimate" />
    )
    expect(instance1.root.findAllByType(Text)[0].props.color).toEqual("black60")
    expect(instance1.root.findAllByType(IncreaseIcon).length).toEqual(1)
    expect(instance1.root.findAllByType(IncreaseIcon)[0].props.fill).toEqual("black60")
    expect(instance2.root.findAllByType(Text)[0].props.color).toEqual("black60")
    expect(instance2.root.findAllByType(IncreaseIcon).length).toEqual(1)
    expect(instance2.root.findAllByType(IncreaseIcon)[0].props.fill).toEqual("black60")
    expect(instance3.root.findAllByType(Text)[0].props.color).toEqual("black60")
    expect(instance3.root.findAllByType(DecreaseIcon).length).toEqual(1)
    expect(instance3.root.findAllByType(DecreaseIcon)[0].props.fill).toEqual("black60")
  })
})
