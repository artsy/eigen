import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Box, CheckIcon, color } from "palette"
import React from "react"
import { ColorsSwatch } from "../ColorsSwatch"

describe("Color swatch", () => {
  it("adds a border when selected", () => {
    const selectedTree = renderWithWrappers(
      <ColorsSwatch
        width={30}
        backgroundColor={color("black100")}
        foregroundColor="#fff"
        name="darkblue"
        selected={true}
      />
    )
    const selectedCheckIcon = selectedTree.root.findByType(CheckIcon)
    expect(selectedCheckIcon.props.fill).toMatch("#fff")

    const unselectedTree = renderWithWrappers(
      <ColorsSwatch
        width={30}
        backgroundColor={color("black10")}
        foregroundColor="#fff"
        name="darkblue"
        selected={false}
      />
    )
    const unselectedCheckIcon = unselectedTree.root.findAllByType(CheckIcon)
    expect(unselectedCheckIcon.length).toEqual(0)
  })

  it("has correct background color for passed in color", () => {
    const darkblue = renderWithWrappers(
      <ColorsSwatch width={30} backgroundColor="#435EA9" foregroundColor="#fff" name="darkblue" selected={true} />
    )
    const darkBlueView = darkblue.root.findAllByType(Box)[1]
    expect(darkBlueView.props.bg).toMatch("#435EA9")

    const blackAndWhite = renderWithWrappers(
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

    const orange = renderWithWrappers(
      <ColorsSwatch width={30} backgroundColor="#F1572C" foregroundColor="#fff" name="darkorange" selected={false} />
    )
    const orangeView = orange.root.findAllByType(Box)[1]
    expect(orangeView.props.bg).toMatch("#F1572C")
  })
})
