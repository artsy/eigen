import "jest-styled-components"
import React from "react"
import renderer from "react-test-renderer"
import { Theme } from "../../../Theme"
import { Text } from "../Text.ios"

describe("Text.ios", () => {
  it("renders the correct line-height and letter-spacing based on the variant", () => {
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

  it("renders the correct line-height and letter-spacing based on the font-size directly", () => {
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
})
