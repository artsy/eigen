import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { View } from "react-native"
import { Box } from ".."

describe("Box", () => {
  it("space works as expected", () => {
    let tree = renderWithWrappers(<Box width={10} height={10} />).root
    expect(tree.findByType(View).props.style).toStrictEqual([{ width: 10, height: 10 }])

    // ml, etc
    // number is number of pixels
    tree = renderWithWrappers(<Box width={10} height={10} ml={1} />).root
    expect(tree.findByType(View).props.style).toStrictEqual([{ width: 10, height: 10, marginLeft: 1 }])

    // string is for our design system
    tree = renderWithWrappers(<Box width={10} height={10} ml="1" />).root
    expect(tree.findByType(View).props.style).toStrictEqual([{ width: 10, height: 10, marginLeft: 10 }])

    // we don't really use these in eigen but let's have them tested
    tree = renderWithWrappers(<Box width={10} height={10} ml={[1, 2]} />).root
    expect(tree.findByType(View).props.style).toStrictEqual([{ width: 10, height: 10, marginLeft: 1 }])

    tree = renderWithWrappers(<Box width={10} height={10} ml={["1", "2"]} />).root
    expect(tree.findByType(View).props.style).toStrictEqual([{ width: 10, height: 10, marginLeft: 10 }])

    // negatives
    tree = renderWithWrappers(<Box width={10} height={10} ml={-1} />).root
    expect(tree.findByType(View).props.style).toStrictEqual([{ width: 10, height: 10, marginLeft: -1 }])

    tree = renderWithWrappers(<Box width={10} height={10} ml="-1" />).root
    expect(tree.findByType(View).props.style).toStrictEqual([{ width: 10, height: 10, marginLeft: -10 }])

    // some extra tests
    tree = renderWithWrappers(<Box width={10} height={10} ml="1.5" />).root
    expect(tree.findByType(View).props.style).toStrictEqual([{ width: 10, height: 10, marginLeft: 15 }])
    tree = renderWithWrappers(<Box width={10} height={10} ml="0.3" />).root
    expect(tree.findByType(View).props.style).toStrictEqual([{ width: 10, height: 10, marginLeft: 3 }])
    tree = renderWithWrappers(<Box width={10} height={10} px="1.5" />).root
    expect(tree.findByType(View).props.style).toStrictEqual([
      { width: 10, height: 10, paddingLeft: 15, paddingRight: 15 },
    ])
    tree = renderWithWrappers(<Box width={10} height={10} ml="auto" />).root
    expect(tree.findByType(View).props.style).toStrictEqual([{ width: 10, height: 10, marginLeft: "auto" }])
  })
})
