import { storiesOf } from "@storybook/react-native"
import { List } from "storybook/helpers"
import { BackButton } from "./BackButton"

storiesOf("palette/atoms/BackButton", module).add("Back Button", () => (
  <List
    style={{ marginLeft: 50, backgroundColor: "orange" }}
    contentContainerStyle={{ alignItems: "flex-start" }}
  >
    <BackButton />
    <BackButton showX />
  </List>
))
