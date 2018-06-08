import { storiesOf } from "@storybook/react-native"
import React from "react"

import { Flex } from "../../Elements/Flex"
import { Serif16 } from "../../Elements/Typography"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { Checkbox } from "../Checkbox"

storiesOf("App Style/Input").add("Check Boxes", () => (
  <BiddingThemeProvider>
    <Flex mt={7}>
      <Checkbox pl={3} pb={1}>
        <Serif16 mt={2}>Remember me</Serif16>
      </Checkbox>

      <Checkbox pl={3} pb={1} checked>
        <Serif16 mt={2}>Remember me</Serif16>
      </Checkbox>

      <Checkbox pl={3} pb={1} error>
        <Serif16 mt={2} color="red100">
          Agree to Terms and Conditions
        </Serif16>
      </Checkbox>

      <Checkbox pl={3} pb={1} checked error>
        <Serif16 mt={2} color="red100">
          Agree to Terms and Conditions
        </Serif16>
      </Checkbox>

      <Checkbox pl={3} pb={1} disabled>
        <Serif16 mt={2}>Remember me</Serif16>
      </Checkbox>

      <Checkbox pl={3} pb={1} checked disabled>
        <Serif16 mt={2}>Remember me</Serif16>
      </Checkbox>
    </Flex>
  </BiddingThemeProvider>
))
