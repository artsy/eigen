import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withThemeV3 } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Pill } from "./Pill"

storiesOf("Pill", module)
  .addDecorator(withThemeV3)
  .add("filter pill", () => (
    <List>
      <Pill>Work on Paper</Pill>
    </List>
  ))
  .add("rounded pill", () => (
    <List>
      <Pill variant="textRound">Artists</Pill>
    </List>
  ))
  .add("rounded pill pressable active", () => (
    <List>
      <Pill active onPress={() => action(`tapped`)} variant="textRound">
        Artworks
      </Pill>
    </List>
  ))
  .add("rounded pill pressable inactive", () => (
    <List>
      <Pill active={false} onPress={() => action(`tapped`)} variant="textRound">
        Artworks
      </Pill>
    </List>
  ))
