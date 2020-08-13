import { storiesOf } from "@storybook/react"
import React from "react"
import { TextArea } from "./TextArea"

const defaultProps = {
  placeholder: "Start typing...",
}

storiesOf("Components/TextArea", module)
  .add("TextArea", () => {
    return <TextArea {...defaultProps} />
  })
  .add("TextArea + title", () => {
    return <TextArea {...defaultProps} title="Note" />
  })
  .add("TextArea + title + required", () => {
    return <TextArea {...defaultProps} title="Note" required />
  })
  .add("TextArea + error", () => {
    return <TextArea {...defaultProps} error="Something went wrong." />
  })
  .add("TextArea + character limit", () => {
    return <TextArea {...defaultProps} characterLimit={10} />
  })
  .add("TextArea + name", () => {
    return <TextArea {...defaultProps} name="my-text-area" />
  })
  .add("TextArea + title + desc", () => {
    return (
      <TextArea
        {...defaultProps}
        name="my-text-area"
        title="Note"
        description="This is my description"
      />
    )
  })
