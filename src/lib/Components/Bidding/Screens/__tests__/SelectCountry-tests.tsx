import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { SelectCountry } from "../SelectCountry"

it("Sets up the right view hierarchy", () => {
  const nav = {} as any

  const component = renderer.create(<SelectCountry navigator={nav} />).toJSON()
  expect(component).toMatchSnapshot()
})
