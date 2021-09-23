import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Box, CloseIcon, Touchable } from "palette"
import { Text } from "palette/elements/Text/Text"
import React from "react"
import { SearchListItem } from "../components/SearchListItem"

const onPressMock = jest.fn()
const onDeleteMock = jest.fn()

const TestPage = (props: any) => {
  return (
    <SearchListItem
      onPress={onPressMock}
      imageURL="testUrl"
      categoryName="Article"
      InfoComponent={() => (
        <Box>
          <Text>Test info</Text>
        </Box>
      )}
      {...props}
    ></SearchListItem>
  )
}

describe("SearchListItem", () => {
  beforeAll(() => {
    jest.clearAllMocks()
  })

  it("displays touchable element and calls passed callback on press", () => {
    const tree = renderWithWrappers(<TestPage />)

    expect(tree.root.findByType(Touchable)).toBeDefined()
    expect(tree.root.findByType(Touchable).props.onPress).toEqual(onPressMock)
    expect(onPressMock).not.toHaveBeenCalled()

    tree.root.findByType(Touchable).props.onPress()

    expect(onPressMock).toHaveBeenCalled()
  })

  it("displays an image with passed url and zero borderRadius", () => {
    const tree = renderWithWrappers(<TestPage />)
    const image = tree.root.findByType(OpaqueImageView)

    expect(image).toBeDefined()
    expect(image.props.imageURL).toEqual("testUrl")
    expect(image.props.style.borderRadius).toEqual(0)
  })

  it("displays an image with borderRadius: 20 when the type is Artist", () => {
    const tree = renderWithWrappers(<TestPage categoryName={"Artist"} />)

    expect(tree.root.findByType(OpaqueImageView).props.style.borderRadius).toEqual(20)
  })

  it("displays text from passed InfoComponent", () => {
    const tree = renderWithWrappers(<TestPage />)

    expect(extractText(tree.root)).toContain("Test info")
  })

  it("does not render delete button when onDelete callback is not passed", () => {
    const tree = renderWithWrappers(<TestPage />)

    expect(tree.root.findAllByType(Touchable)).toHaveLength(1)
    expect(tree.root.findAllByType(CloseIcon)[0]).not.toBeDefined()
  })

  it("displays delete button when onDelete callback is passed and calls it on press", () => {
    const tree = renderWithWrappers(<TestPage onDelete={onDeleteMock} />)

    expect(tree.root.findAllByType(Touchable)).toHaveLength(2)
    expect(tree.root.findAllByType(Touchable)[1].props.onPress).toEqual(onDeleteMock)
    expect(onDeleteMock).not.toHaveBeenCalled()

    tree.root.findAllByType(Touchable)[1].props.onPress()

    expect(onDeleteMock).toHaveBeenCalled()
    expect(tree.root.findByType(CloseIcon)).toBeDefined()
  })
})
