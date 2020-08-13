import { storiesOf } from "@storybook/react"
import React from "react"
import { ProgressBar } from "./ProgressBar"

storiesOf("Components/ProgressBar", module)
  .add("Default", () => {
    return <ProgressBar highlight="purple100" percentComplete={40} />
  })
  .add("Without background", () => {
    return (
      <ProgressBar
        highlight="purple100"
        percentComplete={40}
        showBackground={false}
      />
    )
  })
