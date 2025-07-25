import { ChevronRightIcon } from "@artsy/icons/native"
import { SectionTitle } from "app/Components/SectionTitle"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

describe("SectionTitle", () => {
  it(`renders a title alone`, async () => {
    const tree = renderWithWrappersLEGACY(<SectionTitle title="Hello" />)

    expect(extractText(tree.root)).toContain("Hello")
    expect(tree.root.findAllByType(ChevronRightIcon)).toHaveLength(0)
    expect(tree.root.findAllByProps({ testID: "subtitle" })).toHaveLength(0)
  })

  it(`renders a subtitle when specified`, async () => {
    const tree = renderWithWrappersLEGACY(<SectionTitle title="Hello" subtitle="welcome to test" />)

    expect(extractText(tree.root.findByProps({ testID: "title" }))).toContain("Hello")
    expect(extractText(tree.root.findByProps({ testID: "subtitle" }))).toBe("welcome to test")
    expect(tree.root.findAllByType(ChevronRightIcon)).toHaveLength(0)
  })

  it(`renders a right arrow when given an 'onPress' prop`, async () => {
    const onPress = jest.fn()
    const tree = renderWithWrappersLEGACY(
      <SectionTitle title="Hello" subtitle="welcome to test" onPress={onPress} />
    )

    expect(extractText(tree.root.findByProps({ testID: "title" }))).toContain("Hello")
    expect(extractText(tree.root.findByProps({ testID: "subtitle" }))).toBe("welcome to test")
    expect(tree.root.findAllByType(ChevronRightIcon)).toHaveLength(1)
    tree.root.findByProps({ testID: "touchable-wrapper" }).props.onPress()
    expect(onPress).toHaveBeenCalled()
  })
})
