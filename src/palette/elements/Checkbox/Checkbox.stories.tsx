import { storiesOf } from "@storybook/react-native"
import { LinkText, Text } from "palette"
import React from "react"
import { List } from "storybook/helpers"
import { Checkbox } from "./Checkbox"

storiesOf("Checkbox", module).add("Variants", () => (
  <List>
    <Checkbox />
    <Checkbox text="Checkbox" />
    <Checkbox
      // tslint:disable-next-line: jsx-curly-brace-presence
      text={`Multiline
Text`}
    />
    <Checkbox text="Checkbox" subtitle="Subtitle" />
    <Checkbox
      // tslint:disable-next-line: jsx-curly-brace-presence
      text={`Multiline
Text`}
      subtitle="With Subtitle"
    />

    <Checkbox checked text="Checked" />
    <Checkbox checked={false} text="Unchecked" />
    <Checkbox disabled text="Disabled" />
    <Checkbox error text="With Error" />
    <Checkbox error text="With Error" subtitle="Subtitle" />
    <Checkbox>
      <Text variant="md">
        Agree to <LinkText onPress={() => console.warn("tapped")}>Conditions of Sale</LinkText>
      </Text>
    </Checkbox>
  </List>
))
