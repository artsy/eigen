import { storiesOf } from "@storybook/react-native"
import { Text } from "palette"
import React from "react"
import { List } from "storybook/helpers"
import { Checkbox } from "./CheckboxV2"

storiesOf("CheckboxV2", module).add("Variants", () => (
  <List>
    <Checkbox />
    <Checkbox>
      <Text>Checkbox</Text>
    </Checkbox>
    <Checkbox checked>
      <Text>checked</Text>
    </Checkbox>
    <Checkbox checked={false}>
      <Text>unchecked</Text>
    </Checkbox>
    <Checkbox disabled>
      <Text>disabled</Text>
    </Checkbox>
    <Checkbox error>
      <Text>error</Text>
    </Checkbox>
  </List>
))
