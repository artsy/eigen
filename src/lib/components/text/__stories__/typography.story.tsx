import { storiesOf } from "@storybook/react-native"
import * as React from "react"

import Headline from "../headline"
import Serif from "../serif"

storiesOf("Artsy Typography")
  .add("App Headline", () => {
    return <Headline>This is a Blank headline</Headline>
  })
  .add("App Serif Text", () => {
    return <Serif>This is a blank serif</Serif>
  })
