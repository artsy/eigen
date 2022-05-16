import { storiesOf } from "@storybook/react-native"
import { Button, Flex, Input, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { ArtsyKeyboardAvoidingView } from "shared/utils"

storiesOf("ArtsyKeyboardAvoidingView", module).add("ArtsyKeyboardAvoidingView", () => (
  <ArtsyKeyboardAvoidingView>
    <Flex>
      <ScrollView>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Input title="Email" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Spacer mt={4} />
        <Button>"Submit"</Button>
      </ScrollView>
    </Flex>
  </ArtsyKeyboardAvoidingView>
))
