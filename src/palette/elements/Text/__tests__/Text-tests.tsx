import "jest-styled-components"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Text as RNText } from "react-native"
import renderer from "react-test-renderer"
import { Text } from ".."
import { Theme } from "../../../Theme"

describe(Text, () => {
  xit("renders the correct line-height and letter-spacing based on the variant", () => {
    const tree = renderer
      .create(
        <Theme>
          <Text variant="largeTitle">hello world</Text>
        </Theme>
      )
      .toJSON()

    expect(tree).toHaveStyleRule("font-size", "28px")
    expect(tree).toHaveStyleRule("letter-spacing", "-0.56px")
    expect(tree).toHaveStyleRule("line-height", "35px")
  })

  xit("renders the correct line-height and letter-spacing based on the font-size directly", () => {
    const tree = renderer
      .create(
        <Theme>
          <Text fontSize="size4" letterSpacing="tight" lineHeight="solid">
            hello world
          </Text>
        </Theme>
      )
      .toJSON()

    expect(tree).toHaveStyleRule("font-size", "15px")
    expect(tree).toHaveStyleRule("line-height", "15px")
    expect(tree).toHaveStyleRule("letter-spacing", "-0.3px")
  })

  it("uses the right spacing values", () => {
    let tree = renderWithWrappers(<Text ml={1}>wow</Text>).root
    expect(tree.findByType(RNText).props.style).toContainEqual([{ marginLeft: 1 }])

    tree = renderWithWrappers(<Text ml="1">wow</Text>).root
    expect(tree.findByType(RNText).props.style).toStrictEqual([{ marginLeft: 10 }])
  })
})
