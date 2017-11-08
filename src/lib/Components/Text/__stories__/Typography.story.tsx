import { storiesOf } from "@storybook/react-native"
import React from "react"

import Headline from "../Headline"
import Serif from "../Serif"

storiesOf("App Style/Typography")
  .add("App Headline", () => {
    return <Headline>This is a Blank headline</Headline>
  })
  .add("App Serif Text", () => {
    return <Serif>This is a blank serif</Serif>
  })
