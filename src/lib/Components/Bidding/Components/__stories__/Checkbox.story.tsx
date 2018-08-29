import { Serif } from "@artsy/palette"
import { storiesOf } from "@storybook/react-native"
import React from "react"

import { Flex } from "../../Elements/Flex"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { Checkbox } from "../Checkbox"

storiesOf("App Style/Input").add("Check Boxes", () => (
  <BiddingThemeProvider>
    <Flex mt={7}>
      <Checkbox pl={3} pb={1}>
        <Serif size="3" mt={2}>
          Remember me
        </Serif>
      </Checkbox>

      <Checkbox pl={3} pb={1} checked>
        <Serif size="3" mt={2}>
          Remember me
        </Serif>
      </Checkbox>

      <Checkbox pl={3} pb={1} error>
        <Serif size="3" mt={2} color="red100">
          Agree to Terms and Conditions
        </Serif>
      </Checkbox>

      <Checkbox pl={3} pb={1} checked error>
        <Serif size="3" mt={2} color="red100">
          Agree to Terms and Conditions
        </Serif>
      </Checkbox>

      <Checkbox pl={3} pb={1} disabled>
        <Serif size="3" mt={2}>
          Remember me
        </Serif>
      </Checkbox>

      <Checkbox pl={3} pb={1} checked disabled>
        <Serif size="3" mt={2}>
          Remember me
        </Serif>
      </Checkbox>
    </Flex>
  </BiddingThemeProvider>
))
