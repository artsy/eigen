import { storiesOf } from "@storybook/react-native"
import React from "react"
import "react-native"
import Composer from "../Composer"

storiesOf("Conversations/Composer").add("With no pre-existing thread", () => <Composer />)
