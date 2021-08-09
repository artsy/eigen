import { storiesOf } from "@storybook/react-native"
import React from "react"
import { List } from "storybook/helpers"
import { Checkbox } from "./Checkbox"

storiesOf("Checkbox", module).add("Variants", () => (
  <List>
    <Checkbox />
    <Checkbox text="Checkbox" subtitle="Subtitle" />
    <Checkbox
      text={`Multiline
Text`}
      subtitle="With Subtitle"
    />
    <Checkbox
      text={`Multiline
Text`}
    />
    <Checkbox checked text="Checked" />
    <Checkbox checked={false} text="Unchecked" />
    <Checkbox disabled text="Disabled" />
    <Checkbox error text="With Error" />
    <Checkbox error text="With Error" subtitle="Subtitle" />
  </List>
))
