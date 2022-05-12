import { storiesOf } from "@storybook/react-native"
import { Text } from "palette"
import React from "react"
import { withScreenDimensions } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Select } from "./Select"

const options = [
  {
    label: "Option 1",
    value: "option-1",
    searchTerms: ["Option 1"],
  },
  {
    label: "Option 2",
    value: "option-2",
    searchTerms: ["Option 2"],
  },
]

storiesOf("Select", module)
  .addDecorator(withScreenDimensions)
  .add("Variants", () => (
    <List>
      <Select
        title="Title"
        showTitleLabel={false}
        options={options}
        value="option-1"
        onSelectValue={() => null}
      />
      <Select title="Title" options={options} value={null} onSelectValue={() => null} />
      <Select
        title="Tooltip"
        options={options}
        value={null}
        onSelectValue={() => null}
        tooltipText="What is this?"
        onTooltipPress={() => null}
      />
      <Select
        title="Title"
        subTitle="Subtitle"
        options={options}
        placeholder="placeholder!"
        value={null}
        onSelectValue={() => null}
      />
      <Select title="Title" options={options} required value={null} onSelectValue={() => null} />
      <Select
        title="Title"
        subTitle="Subtitle"
        options={options}
        optional
        value={null}
        onSelectValue={() => null}
      />
      <Select
        title="With Search"
        enableSearch
        options={options}
        value="option-1"
        onSelectValue={() => null}
      />
      <Select
        title="With Max Modal Height"
        maxModalHeight={200}
        options={options}
        value="option-1"
        onSelectValue={() => null}
      />
      <Select
        title="With Error"
        hasError
        options={options}
        value="option-1"
        onSelectValue={() => null}
      />
      <Select
        title="CustomButton"
        renderButton={({ selectedValue }) => <Text>{"Custom " + selectedValue}</Text>}
        options={options}
        value="option-1"
        onSelectValue={() => null}
      />
    </List>
  ))
