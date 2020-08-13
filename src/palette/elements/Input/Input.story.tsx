import { storiesOf } from "@storybook/react"
import React from "react"
import { Input } from "./Input"

const defaultProps = {
  placeholder: "Start typing…",
}

storiesOf("Components/Input", module)
  .add("Input", () => {
    return <Input {...defaultProps} />
  })
  .add("Input + title", () => {
    return <Input {...defaultProps} title="Your offer" />
  })
  .add("Input + title + required", () => {
    return <Input {...defaultProps} title="Your offer" required />
  })
  .add("Input + title + desc", () => {
    return (
      <Input
        {...defaultProps}
        title="Your offer"
        description="This is my description"
      />
    )
  })
  .add("Input + error", () => {
    return <Input {...defaultProps} error="Something went wrong." />
  })
  .add("Input + disabled", () => {
    return <Input {...defaultProps} disabled />
  })
  .add("Input + specified width", () => {
    return <Input style={{ width: "50%" }} {...defaultProps} />
  })
