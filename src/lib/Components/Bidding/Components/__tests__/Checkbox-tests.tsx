import React from "react"
import { Text } from "react-native"
import * as renderer from "react-test-renderer"

import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { Checkbox } from "../Checkbox"

it("renders properly", () => {
  const bg = renderer
    .create(
      <BiddingThemeProvider>
        <Checkbox>
          <Text>Remember me</Text>
        </Checkbox>
      </BiddingThemeProvider>
    )
    .toJSON()

  expect(bg).toMatchSnapshot()
})
