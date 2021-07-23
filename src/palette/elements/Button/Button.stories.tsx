import { ComponentMeta, ComponentStory } from "@storybook/react-native"
import React from "react"
import { Button } from "./Button"

const MyButtonMeta: ComponentMeta<typeof Button> = {
  title: "MyButton",
  component: Button,
  argTypes: {
    onPress: { action: "pressed the button!" },
  },
  args: {
    children: "Hello world",
  },
}

export default MyButtonMeta

type MyButtonStory = ComponentStory<typeof Button>

export const Basic: MyButtonStory = (args) => <Button {...args} />
