import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"
import { RadioButton } from "./RadioButton"

storiesOf("RadioButton", module)
  .addDecorator(withTheme)
  .add("Variants", () => (
    <List>
      <RadioButton />
      <RadioButton text="RadioButton" />
      <RadioButton
        text={`Multiline
Text`}
      />
      <RadioButton text="RadioButton" subtitle="Subtitle" />
      <RadioButton
        text={`Multiline
Text`}
        subtitle="With Subtitle"
      />

      <RadioButton selected text="Selected" />
      <RadioButton selected={false} text="Not Selected" />
      <RadioButton disabled text="Disabled" />
      <RadioButton error text="With Error" />
      <RadioButton error text="With Error" subtitle="Subtitle" />
    </List>
  ))
