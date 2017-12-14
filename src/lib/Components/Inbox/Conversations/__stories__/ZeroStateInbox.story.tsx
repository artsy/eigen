import { storiesOf } from "@storybook/react-native"
import React from "react"
import "react-native"
import ZeroStateInbox from "../ZeroStateInbox"

storiesOf("Conversations/ZeroStateInbox").add("No conversations", () => <ZeroStateInbox />)
