import { storiesOf } from "@storybook/react-native"
import React from "react"
import { List } from "storybook/helpers"
import { RadioButton } from "./RadioButtonV2"

storiesOf("RadioButtonV2", module).add("Variants", () => (
  <List>
    <RadioButton selected text={"Selected"} />
    <RadioButton selected={false} text={"Not Selected"} />
  </List>
))
