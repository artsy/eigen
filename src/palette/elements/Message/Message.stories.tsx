import { storiesOf } from "@storybook/react-native"
import { Message } from "palette"
import React from "react"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"

storiesOf("Message", module)
  .addDecorator(withTheme)
  .add("Variants", () => (
    <List contentContainerStyle={{ marginHorizontal: 20, alignItems: "stretch" }}>
      <Message variant="default" title="Without Close Button" text="Text" />
      <Message variant="default" showCloseButton title="Title" text="Text" />
      <Message
        variant="default"
        showCloseButton
        title="Title"
        text="Very very very very very very very very very very very very very very long text"
      />
      <Message
        variant="default"
        showCloseButton
        title="Very very very very very very very very very very very very very very long title"
        text="Text"
      />
      <Message
        variant="default"
        showCloseButton
        title="Very very very very very very very very very very very very very very long title"
        text="Very very very very very very very very very very very very very very long text"
      />
    </List>
  ))
  .add("Color Variants", () => (
    <List contentContainerStyle={{ marginHorizontal: 20, alignItems: "stretch" }}>
      <Message variant="default" showCloseButton title="Default" text="Text" />
      <Message variant="info" showCloseButton title="Info" text="Text" />
      <Message variant="success" showCloseButton title="Success" text="Text" />
      <Message variant="warning" showCloseButton title="Warning" text="Text" />
      <Message variant="error" showCloseButton title="Error" text="Text" />
    </List>
  ))
