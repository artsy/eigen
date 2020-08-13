import { storiesOf } from "@storybook/react"
import React from "react"
import { LargeSelect, SelectSmall } from "./Select"

const options = [
  {
    text: "First",
    value: "firstValue",
  },
  {
    text: "Last",
    value: "lastValue",
  },
]

storiesOf("Components/Select", module)
  .add("LargeSelect", () => {
    return <LargeSelect options={options} selected="lastValue" />
  })
  .add("Select only", () => {
    return <LargeSelect options={options} />
  })
  .add("Select + Title", () => {
    return <LargeSelect options={options} title="Pick something" />
  })
  .add("Select + Title + Required", () => {
    return <LargeSelect options={options} required title="Pick something" />
  })
  .add("Select + Title + Description", () => {
    return (
      <LargeSelect
        description="This matters a lot."
        options={options}
        title="Pick something"
      />
    )
  })
  .add("Select with error", () => {
    return <LargeSelect error="Something went wrong." options={options} />
  })
  .add("Disabled Select", () => {
    return <LargeSelect disabled options={options} />
  })
  .add("SelectSmall with title", () => {
    return (
      <SelectSmall
        options={[
          {
            text: "Price",
            value: "price",
          },
          {
            text: "Estimate and some other text",
            value: "estimate",
          },
        ]}
        title="Sort"
      />
    )
  })
  .add("SelectSmall without title", () => {
    return (
      <SelectSmall
        options={[
          {
            text: "First option",
            value: "firstOption",
          },
          {
            text: "Second option that is really long",
            value: "SecondOption",
          },
        ]}
        selected="SecondOption"
      />
    )
  })
