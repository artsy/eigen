import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react"
import React from "react"
import { Sans } from "../Typography"
import { Clickable } from "./Clickable"

storiesOf("Components/Clickable", module).add("Default", () => {
  return (
    <Clickable onClick={action("onClick")} p={3}>
      <Sans size="4">Click</Sans>
      <Sans size="1">or click</Sans>
    </Clickable>
  )
})
