import { storiesOf } from "@storybook/react-native"
import React from "react"
import { List } from "storybook/helpers"
import { Avatar } from "./Avatar"

storiesOf("Avatar", module)
  .add("Sizes", () => (
    <List>
      <Avatar initials="MD" size="md" />
      <Avatar initials="SM" size="sm" />
      <Avatar initials="XS" size="xs" />
      <Avatar initials="XXS" size="xxs" />
    </List>
  ))
  .add("Variants", () => (
    <List>
      <Avatar
        src="https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F2qiqRkUQYxTnUaib3yIgpA%2Funtouched-jpg.jpg&width=1820&height=1214&quality=75"
        size="md"
      />
      <Avatar size="md" />
      <Avatar initials="TOOMANYINITIALS" size="md" />
    </List>
  ))
