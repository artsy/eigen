import { storiesOf } from "@storybook/react-native"
import React from "react"
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

storiesOf("Select", module).add("Variants", () => (
  <List>
    <Select title="Select" options={options} value="option-1" onSelectValue={() => null} />
    <Select title="Select" showTitleLabel={false} options={options} value="option-1" onSelectValue={() => null} />
  </List>
))
