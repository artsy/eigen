import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { Text } from "palette"
import { AuctionResultsMidEstimate } from "./AuctionResultMidEstimate"

describe("AuctionResultMidEstimate", () => {
  it("renders properly when the percentage is greater than 5", () => {
    const tree = renderWithWrappersLEGACY(
      <AuctionResultsMidEstimate value="25%" shortDescription="mid-estimate" />
    )
    expect(tree.root.findAllByType(Text)[0].props.color).toEqual("green100")
  })

  it("renders properly when the percentage is less than -5", () => {
    const tree = renderWithWrappersLEGACY(
      <AuctionResultsMidEstimate value="-25%" shortDescription="mid-estimate" />
    )
    expect(tree.root.findAllByType(Text)[0].props.color).toEqual("red100")
  })

  it("renders properly when the percentage is between -5 and 5", () => {
    const instance1 = renderWithWrappersLEGACY(
      <AuctionResultsMidEstimate value="2%" shortDescription="mid-estimate" />
    )
    const instance2 = renderWithWrappersLEGACY(
      <AuctionResultsMidEstimate value="2%" shortDescription="mid-estimate" />
    )
    const instance3 = renderWithWrappersLEGACY(
      <AuctionResultsMidEstimate value="-2%" shortDescription="mid-estimate" />
    )
    expect(instance1.root.findAllByType(Text)[0].props.color).toEqual("black60")
    expect(instance2.root.findAllByType(Text)[0].props.color).toEqual("black60")
    expect(instance3.root.findAllByType(Text)[0].props.color).toEqual("black60")
  })
})
