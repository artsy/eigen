import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { TextInput } from "react-native"
import { SelectCountry } from "../SelectCountry"

import { BiddingThemeProvider } from "../../Components/BiddingThemeProvider"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <BiddingThemeProvider>
      <SelectCountry navigator={{} as any} />
    </BiddingThemeProvider>
  )
})

it("pre-populates the country field if initial country is provided", () => {
  const component = renderWithWrappers(
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
