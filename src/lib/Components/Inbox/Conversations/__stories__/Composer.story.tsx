import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import "react-native"
import Composer from "../Composer"

storiesOf("Conversations - Composer").add("With no pre-existing thread", () => <Composer />)
