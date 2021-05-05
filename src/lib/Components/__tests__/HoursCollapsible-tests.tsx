import { Markdown } from "lib/Components/Markdown"
import { __deprecated_mountWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { HoursCollapsible } from "../HoursCollapsible"

describe("HoursCollapsible", () => {
  const hours = {
    text: "Monday: Foo - Bar\nTuesday: Bar - Baz\nWednesday - Friday: Closed",
  }

  it("renders properly", () => {
    const comp = __deprecated_mountWithWrappers(<HoursCollapsible openingHours={hours} />)

    expect(comp.text()).toContain("Opening hours")
  })

  it("expands when pressed", () => {
    const comp = __deprecated_mountWithWrappers(<HoursCollapsible openingHours={hours} />)

    comp.find(TouchableWithoutFeedback).props().onPress()

    expect(comp.text()).toContain(hours.text)
  })

  it("renders markdown", () => {
    const markdownHours = {
      text: "**Collectors Preview**\r\nNovember 8 Thursday 14:00 to 20:00\r\n [November 9th](http://foo.bar)",
    }

    const comp = __deprecated_mountWithWrappers(<HoursCollapsible openingHours={markdownHours} />)

    comp.find(TouchableWithoutFeedback).props().onPress()

    comp.update()

    expect(comp.find(Markdown).length).toEqual(1)
  })
})
