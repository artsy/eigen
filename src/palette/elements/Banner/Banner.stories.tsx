import { storiesOf } from "@storybook/react-native"
import { Banner } from "palette"
import React from "react"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"

storiesOf("Banner", module)
  .addDecorator(withTheme)
  .add("Variants", () => (
    <List contentContainerStyle={{ marginHorizontal: 20, alignItems: "stretch" }}>
      <Banner variant="default" title="Without Close Button" text="Text" />
      <Banner variant="default" showCloseButton title="Title" text="Text" />
      <Banner
        variant="default"
        showCloseButton
        title="Title"
        text="Very very very very very very very very very very very very very very long text"
      />
      <Banner
        variant="default"
        showCloseButton
        title="Very very very very very very very very very very very very very very long title"
        text="Text"
      />
      <Banner
        variant="default"
        showCloseButton
        title="Very very very very very very very very very very very very very very long title"
        text="Very very very very very very very very very very very very very very long text"
      />
    </List>
  ))
  .add("Color Variants", () => (
    <List contentContainerStyle={{ marginHorizontal: 20, alignItems: "stretch" }}>
      <Banner variant="default" showCloseButton title="Title" text="Text" />
      <Banner variant="info" showCloseButton title="Title" text="Text" />
      <Banner variant="success" showCloseButton title="Title" text="Text" />
      <Banner variant="warning" showCloseButton title="Title" text="Text" />
      <Banner variant="error" showCloseButton title="Title" text="Text" />
    </List>
  ))
