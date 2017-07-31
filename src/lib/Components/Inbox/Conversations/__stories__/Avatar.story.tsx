import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import "react-native"
import Avatar from "../Avatar"

storiesOf("Conversations/Avatar").add("User with Two Initials", () => <Avatar isUser={true} initials="MC" />)
