import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withThemeV3 } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Pill } from "./Pill"

storiesOf("Pill", module)
  .addDecorator(withThemeV3)
  .add("Artist", () => (
    <List>
      <Pill size="sm" rounded image_url={"https://ychef.files.bbci.co.uk/976x549/p0400cts.jpg"}>
        Default
      </Pill>
    </List>
  ))
  .add("Filter", () => (
    <List>
      <Pill size="xs" rounded>
        Selected
      </Pill>
      <Pill size="xs" check>
        Checked
      </Pill>
      <Pill size="xs" cross>
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
