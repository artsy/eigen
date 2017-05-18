import { storiesOf } from "@kadira/react-native-storybook"
import * as React from "react"
import { RootContainer } from "react-relay"

import Headline from "../headline"
import Serif from "../serif"

storiesOf("🎨 Typography")
  .add("App Headline", () => {
    return <Headline>This is a balnk headline</Headline>
  })
  .add("App Serif Text", () => {
    return <Serif>This is a blank serif</Serif>
  })
