import { storiesOf } from "@storybook/react-native"
import { Banner } from "palette"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"

storiesOf("Banner", module)
  .addDecorator(withTheme)
  .add("Variants", () => (
    <List contentContainerStyle={{ marginHorizontal: 20, alignItems: "stretch" }}>
      <Banner title="Without Close Button" text="Text" />
      <Banner showCloseButton title="Title" text="Text" />
      <Banner
        showCloseButton
        title="Title"
        text="Very very very very very very very very very very very very very very long text"
      />
      <Banner
        showCloseButton
        title="Very very very very very very very very very very very very very very long title"
        text="Text"
      />
      <Banner
        showCloseButton
        title="Very very very very very very very very very very very very very very long title"
        text="Very very very very very very very very very very very very very very long text"
      />
    </List>
  ))
