import React from "react"
import { TextInput } from "react-native"
import * as renderer from "react-test-renderer"
import { SelectCountry } from "../SelectCountry"

import { Theme } from "@artsy/palette"

it("Sets up the right view hierarchy", () => {
  const nav = {} as any

  const component = renderer
    .create(
      <Theme>
        <SelectCountry navigator={nav} />
      </Theme>
    )
    .toJSON()
  expect(component).toMatchSnapshot()
})

it("pre-populates the country field if initial country is provided", () => {
  const component = renderer.create(
    <Theme>
      <SelectCountry
        country={{
          longName: "United States",
          shortName: "USA",
        }}
        navigator={{} as any}
      />
    </Theme>
  )

  const countryInput = component.root.findByType(TextInput)

  expect(countryInput.props.value).toEqual("United States")
})
