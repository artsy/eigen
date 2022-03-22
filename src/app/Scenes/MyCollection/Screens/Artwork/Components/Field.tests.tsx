import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Field } from "./OldField"

describe("Field", () => {
  it("returns null when value isnt defined", () => {
    const wrapper = renderWithWrappers(<Field label="foo" value={null} />)
    expect(extractText(wrapper.root)).not.toContain("foo")
  })

  it("returns value when value is falsy", () => {
    const wrapper = renderWithWrappers(<Field label="foo" value="" />)
    expect(extractText(wrapper.root)).not.toContain(false)
  })

  it("renders a label and value", () => {
    const wrapper = renderWithWrappers(<Field label="foo" value="bar" />)
    expect(extractText(wrapper.root)).toContain("foo")
    expect(extractText(wrapper.root)).toContain("bar")
  })
})
