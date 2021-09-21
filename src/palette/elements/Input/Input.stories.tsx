import { storiesOf } from "@storybook/react-native"
import SearchIcon from "lib/Icons/SearchIcon"
import { Flex, Input } from "palette"
import React from "react"
import { View } from "react-native"
import { withThemeV3 } from "storybook/decorators"
import { List } from "storybook/helpers"

storiesOf("InputV3", module)
  .addDecorator(withThemeV3)
  .add("Variants", () => (
    <View style={{ flex: 1, width: "100%" }}>
      <List>
        <Flex width={200}>
          <Input />
        </Flex>
        <Flex width={200}>
          <Input title="Title" />
        </Flex>
        <Flex width={200}>
          <Input title="Title" description="Subtitle" />
        </Flex>
        <Flex width={200}>
          <Input title="Title" description="With clear button" enableClearButton />
        </Flex>
        <Flex width={200}>
          <Input title="Title" description="With loading" loading />
        </Flex>
        <Flex width={200}>
          <Input title="Title" description="With icon" icon={<SearchIcon />} />
        </Flex>
        <Flex width={200}>
          <Input title="Title" description="With error" error="this is an error" />
        </Flex>
        <Flex width={200}>
          <Input title="Required" required />
        </Flex>
        <Flex width={200}>
          <Input title="Disabled" disabled />
        </Flex>
        <Flex width={200}>
          <Input placeholder="I'm a placeholder" />
        </Flex>
      </List>
    </View>
  ))
