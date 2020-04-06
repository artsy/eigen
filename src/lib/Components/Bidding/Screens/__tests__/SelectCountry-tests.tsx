import React from "react"
import { TextInput } from "react-native"
import * as renderer from "react-test-renderer"
import { SelectCountry } from "../SelectCountry"

import { BiddingThemeProvider } from "../../Components/BiddingThemeProvider"

it("renders without throwing an error", () => {
  renderer.create(
    <BiddingThemeProvider>
      <SelectCountry navigator={{} as any} />
    </BiddingThemeProvider>
  )
})

it("pre-populates the country field if initial country is provided", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <SelectCountry
        country={{
          longName: "United States",
          shortName: "USA",
        }}
        navigator={{} as any}
      />
    </BiddingThemeProvider>
  )

  const countryInput = component.root.findByType(TextInput)

  expect(countryInput.props.value).toEqual("United States")
})
