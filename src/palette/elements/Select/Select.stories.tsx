import { storiesOf } from "@storybook/react-native"
import { Text } from "palette"
import React from "react"
import { withThemeV3 } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Select } from "./Select"

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

storiesOf("Select", module)
  .addDecorator(withThemeV3)
  .add("Variants", () => (
    <List>
      <Select title="Title" showTitleLabel={false} options={options} value="option-1" onSelectValue={() => null} />
      <Select title="Title" options={options} value="option-1" onSelectValue={() => null} />
      <Select title="Title" subTitle="Subtitle" options={options} value="option-1" onSelectValue={() => null} />
      <Select title="With Search" enableSearch options={options} value="option-1" onSelectValue={() => null} />
      <Select
        title="With Max Modal Height"
        maxModalHeight={200}
        options={options}
        value="option-1"
        onSelectValue={() => null}
      />
      <Select title="With Error" hasError options={options} value="option-1" onSelectValue={() => null} />
      <Select
        title="CustomButton"
        renderButton={({ selectedValue }) => <Text>{"Custom " + selectedValue}</Text>}
        options={options}
        value="option-1"
        onSelectValue={() => null}
      />
    </List>
  ))
