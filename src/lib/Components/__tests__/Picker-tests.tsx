import { render } from "enzyme"
import { Picker, PickerType } from "lib/Components/Picker"
import React from "react"

describe("Picker", () => {
  it("Renders prompt when selected is undefined", () => {
    const comp = render(
      <Picker prompt="foo" options={[{ text: "bar", value: "baz" }]} type={PickerType.Small} onSelect={jest.fn()} />
    )

    expect(comp.text()).toContain("foo")
  })

  it("Renders selected option text", () => {
    const comp = render(
      <Picker
        prompt="foo"
        options={[{ text: "bar", value: "baz" }]}
        type={PickerType.Small}
        onSelect={jest.fn()}
        selected="baz"
      />
    )

    expect(comp.text()).toContain("bar")
    expect(comp.text()).not.toContain("foo")
  })
})
