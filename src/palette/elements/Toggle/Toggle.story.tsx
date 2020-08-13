import { storiesOf } from "@storybook/react"
import React from "react"
import { Box } from "../Box"
import { Link } from "../Link"
import { Toggle } from "./Toggle"

const SecondaryAction = () => {
  return (
    <Link
      onClick={e => {
        alert("hello world!")
        e.stopPropagation()
      }}
    >
      Alert
    </Link>
  )
}

storiesOf("Components/Toggle", module)
  .add("Toggle", () => {
    return (
      <Box width="350px">
        <Toggle label="Test" expanded>
          <h1>Hello world</h1>
        </Toggle>
      </Box>
    )
  })
  .add("Toggle disabled", () => {
    return (
      <Box width="350px">
        <Toggle label="Test" expanded disabled>
          <h1>Hello world</h1>
        </Toggle>
      </Box>
    )
  })
  .add("Toggle with secondary action", () => {
    return (
      <Box width="350px">
        <Toggle label="Test" expanded renderSecondaryAction={SecondaryAction}>
          <h1>Hello world</h1>
        </Toggle>
      </Box>
    )
  })
  .add("Toggle disabled with secondary action", () => {
    return (
      <Box width="350px">
        <Toggle
          label="Test"
          expanded
          disabled
          renderSecondaryAction={SecondaryAction}
        >
          <h1>Hello world</h1>
        </Toggle>
      </Box>
    )
  })
