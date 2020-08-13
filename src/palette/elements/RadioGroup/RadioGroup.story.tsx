import { storiesOf } from "@storybook/react"
import React, { useState } from "react"
import { BorderBox } from "../BorderBox/BorderBox.ios"
import { Radio } from "../Radio/Radio"
import { RadioGroup } from "./RadioGroup"

storiesOf("Components/RadioGroup", module)
  .add("With default value", () => {
    const RadioGroupToggle = () => {
      const [defaultValue, setValue] = useState("PICKUP")
      return (
        <>
          <BorderBox
            mb={2}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setValue(defaultValue === "PICKUP" ? "SHIP" : "PICKUP")
            }}
          >
            Toggle default value: {defaultValue}
          </BorderBox>
          <RadioGroup defaultValue={defaultValue}>
            <Radio value="SHIP" label="Provide shipping address" />
            <Radio value="PICKUP" label="Arrange for pickup" />
          </RadioGroup>
        </>
      )
    }
    return <RadioGroupToggle />
  })
  .add("Deselectable", () => {
    return (
      <RadioGroup defaultValue="SHIP" deselectable>
        <Radio value="SHIP" label="Provide shipping address" />
        <Radio value="PICKUP" label="Arrange for pickup" />
      </RadioGroup>
    )
  })
  .add("Disabled", () => {
    return (
      <RadioGroup defaultValue="SHIP" disabled disabledText="disabled text">
        <Radio value="SHIP" label="Provide shipping address" />
        <Radio value="PICKUP" label="Arrange for pickup" />
      </RadioGroup>
    )
  })
