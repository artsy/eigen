import { storiesOf } from "@storybook/react-native"
import { CheckIcon, CloseIcon } from "palette"
import React from "react"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Pill } from "./Pill"

storiesOf("Pill", module)
  .addDecorator(withTheme)
  .add("Artist", () => (
    <List>
      <Pill size="sm" selected={false} rounded imageUrl="https://ychef.files.bbci.co.uk/976x549/p0400cts.jpg">
        Artist Name Pill
      </Pill>
    </List>
  ))
  .add("Filter", () => (
    <List>
      <Pill selected={false} size="xs" rounded>
        Filter Rounded
      </Pill>
      <Pill size="xs" icon={<CheckIcon fill="black100" />}>
        Checked
      </Pill>
      <Pill size="xs" icon={<CloseIcon fill="black100" />} iconPosition="right">
        Crossed
      </Pill>
    </List>
  ))
  .add("Text", () => (
    <List>
      <Pill selected={false}>Not Selected</Pill>
      <Pill>Selected</Pill>
      <Pill rounded selected={false}>
        Not Selected
      </Pill>
      <Pill rounded>Selected</Pill>
    </List>
  ))
