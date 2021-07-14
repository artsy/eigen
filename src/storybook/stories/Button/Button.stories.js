import { action } from "@storybook/addon-actions"
import { text } from "@storybook/addon-knobs"
import { storiesOf } from "@storybook/react-native"
import React from "react"
import { Text } from "react-native"
import { Button, Spacer } from "palette"
import CenterView from "../CenterView"

const sizes = ["small", "medium", "large"]
const variants = [
  "primaryBlack",
  "primaryWhite",
  "secondaryGray",
  "secondaryOutline",
  "secondaryOutlineWarning",
  "noOutline",
]

const buttonStories = storiesOf("Button", module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .add("Sizes", () => (
    <List>
      {sizes.map((size) => (
        <Button size={size}>
          <Text>{text("Button text", "Hello")}</Text>
        </Button>
      ))}
    </List>
  ))
  .add("Variants", () => (
    <List>
      {variants.map((variant) => (
        <Button variant={variant}>
          <Text>{text("Button text", "Hello")}</Text>
        </Button>
      ))}
    </List>
  ))

const List = ({ children }) => (
  <>
    {children.map((item) => (
      <>
        {item}
        <Spacer mb={2} />
      </>
    ))}
  </>
)

// sizes.forEach((size) => {
//   buttonStories.add(size, () => (
//     <Button size={size}>
//       <Text>{text("Button text", "Hello")}</Text>
//     </Button>
//   ))
// })

// variants.forEach((variant) => {
//   buttonStories.add(variant, () => (
//     <Button variant={variant}>
//       <Text>{text("Button text", "Hello")}</Text>
//     </Button>
//   ))
// })

// .add("with some emoji", () => (
//   <Button onPress={action("clicked-emoji")}>
//     <Text>😀 😎 👍 💯</Text>
//   </Button>
// ))
