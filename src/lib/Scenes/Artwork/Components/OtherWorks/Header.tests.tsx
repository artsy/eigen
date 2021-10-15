// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Text, Theme } from "palette"
import React from "react"
import { Header } from "./Header"

describe("ArtworkAvailability", () => {
  it("renders artwork availability correctly", () => {
    const component = mount(
      <Theme>
        <Header title="This Is A Test" />
      </Theme>
    )

    expect(component.find(Text).render().text()).toMatchInlineSnapshot(`"This Is A Test"`)
  })
})
