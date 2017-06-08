import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import "react-native"
import { RootContainer } from "react-relay"
import StubContainer from "react-storybooks-relay-container"

import Routes from "../../../../relay/routes"
import Composer from "../composer"

storiesOf("Conversations - Composer")
  .add("With no preexisting thread", () => <Composer />

