import { storiesOf } from "@storybook/react"
import React from "react"
import { Spinner } from "./Spinner"

storiesOf("Components/Spinner", module)
  .add("Default Spinner", () => {
    return <Spinner />
  })

  .add("Spinner with delayed show", () => {
    return <Spinner delay={1000} />
  })
