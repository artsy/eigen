import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withScreenDimensions, withThemeV2 } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Select } from "./SelectV2"

const options = [
  {
    label: "Option 1",
    value: "option-1",
  },
  {
    label: "Option 2",
    value: "option-2",
  },
]

storiesOf("SelectV2", module)
  .addDecorator(withThemeV2)
  .addDecorator(withScreenDimensions)
  .add("Variants", () => (
    <List>
      <Select title="Select" options={options} value="option-1" onSelectValue={() => null} />
      <Select title="Select" showTitleLabel={false} options={options} value="option-1" onSelectValue={() => null} />
    </List>
  ))
