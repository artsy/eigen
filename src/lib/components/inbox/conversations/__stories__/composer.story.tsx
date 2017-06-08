import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import "react-native"
import Composer from "../composer"

storiesOf("Conversations - Composer")
  .add("With no preexisting thread", () => <Composer />)
