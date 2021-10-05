import { storiesOf } from "@storybook/react-native"
import SearchIcon from "lib/Icons/SearchIcon"
import { Input } from "palette"
import React from "react"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"

storiesOf("Input", module)
  .addDecorator(withTheme)
  .add("Variants", () => (
    <List contentContainerStyle={{ marginHorizontal: 20, alignItems: "stretch" }}>
      <Input />
      <Input title="Title" />
      <Input title="Title" description="Subtitle" />
      <Input title="Title" description="With clear button" enableClearButton />
      <Input title="Title" description="With loading" loading />
      <Input title="Title" description="With icon" icon={<SearchIcon />} />
      <Input title="Title" description="With error" error="this is an error" />
      <Input title="Required" required />
      <Input title="Disabled" disabled />
      <Input placeholder="I'm a placeholder" />
      <Input title="full text" value="Wow this is a long text, I wonder if I can read the whole thing!" />
    </List>
  ))
