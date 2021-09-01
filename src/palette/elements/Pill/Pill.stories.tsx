import { storiesOf } from "@storybook/react-native"
import { CheckIcon, CloseIcon } from "palette"
import React from "react"
import { withThemeV3 } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Pill } from "./Pill"

storiesOf("Pill", module)
  .addDecorator(withThemeV3)
  .add("Artist", () => (
    <List>
      <Pill size="sm" rounded imageUrl={"https://ychef.files.bbci.co.uk/976x549/p0400cts.jpg"}>
        Default
      </Pill>
    </List>
  ))
  .add("Filter", () => (
    <List>
      <Pill size="xs" rounded>
        Selected
      </Pill>
      <Pill size="xs" icon={<CheckIcon fill="black100" mr={1} />}>
        Checked
      </Pill>
      <Pill size="xs" icon={<CloseIcon fill="black100" ml={1} />} iconPosition="right">
        Crossed
      </Pill>
    </List>
  ))
  .add("Text", () => (
    <List>
      <Pill size="xxs">Default</Pill>
      <Pill size="xxs" selected>
        Selected
      </Pill>
      <Pill size="xxs" rounded>
        Default
      </Pill>
      <Pill size="xxs" rounded selected>
        Selected
      </Pill>
    </List>
  ))
