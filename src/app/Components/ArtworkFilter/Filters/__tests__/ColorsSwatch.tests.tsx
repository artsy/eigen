import { CheckIcon, Box } from "@artsy/palette-mobile"
import { ColorsSwatch } from "app/Components/ArtworkFilter/Filters/ColorsSwatch"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

describe("Colors swatch", () => {
  it("adds a check icon when selected", () => {
    const selectedTree = renderWithWrappersLEGACY(
      <ColorsSwatch
        width={30}
        backgroundColor="mono100"
        foregroundColor="#fff"
        name="blue"
        selected
      />
    )
    const selectedCheckIcon = selectedTree.root.findByType(CheckIcon)
    expect(selectedCheckIcon.props.fill).toMatch("#fff")

    const unselectedTree = renderWithWrappersLEGACY(
      <ColorsSwatch
        width={30}
        backgroundColor="mono100"
        foregroundColor="#fff"
        name="blue"
        selected={false}
      />
    )
    const unselectedCheckIcon = unselectedTree.root.findAllByType(CheckIcon)
    expect(unselectedCheckIcon.length).toEqual(0)
  })

  it("has correct background color for passed in color", () => {
    const blue = renderWithWrappersLEGACY(
      <ColorsSwatch
        width={30}
        backgroundColor="#435EA9"
        foregroundColor="#fff"
        name="blue"
        selected
      />
    )
    const darkBlueView = blue.root.findAllByType(Box)[1]
    expect(darkBlueView.props.bg).toMatch("#435EA9")

    const blackAndWhite = renderWithWrappersLEGACY(
      <ColorsSwatch
        width={30}
        backgroundColor="#595A5B"
        foregroundColor="#fff"
        name="black-and-white"
        selected={false}
      />
    )
    const blackAndWhiteView = blackAndWhite.root.findAllByType(Box)[1]

    expect(blackAndWhiteView.props.bg).toMatch("#595A5B")

    const orange = renderWithWrappersLEGACY(
      <ColorsSwatch
        width={30}
        backgroundColor="#F1572C"
        foregroundColor="#fff"
        name="orange"
        selected={false}
      />
    )
    const orangeView = orange.root.findAllByType(Box)[1]
    expect(orangeView.props.bg).toMatch("#F1572C")
  })
})
