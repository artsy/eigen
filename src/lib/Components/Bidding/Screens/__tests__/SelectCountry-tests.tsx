import React from "react"
import { TextInput } from "react-native"
import * as renderer from "react-test-renderer"
import { SelectCountry } from "../SelectCountry"

it("Sets up the right view hierarchy", () => {
  const nav = {} as any

  const component = renderer.create(<SelectCountry navigator={nav} />).toJSON()
  expect(component).toMatchSnapshot()
})

it("pre-populates the country field if initial country is provided", () => {
  const component = renderer.create(
    <SelectCountry country={{ longName: "United States", shortName: "USA" }} navigator={{} as any} />
  )

  const countryInput = component.root.findByType(TextInput)

  expect(countryInput.props.value).toEqual("United States")
})
