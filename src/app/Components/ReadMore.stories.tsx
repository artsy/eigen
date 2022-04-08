import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withTracking } from "storybook/decorators"
import { List } from "storybook/helpers"
import { ReadMore } from "./ReadMore"

storiesOf("ReadMore", module)
  .addDecorator(withTracking)
  .add("Misc", () => (
    <List contentContainerStyle={{ alignItems: "flex-start" }}>
      <ReadMore maxChars={3} content="Small text." />
      <ReadMore maxChars={11} content="Small [text](/artist/andy-warhol)." />
      <ReadMore
        maxChars={30}
        // tslint:disable-next-line: jsx-curly-brace-presence
        content={`Line break


Which should render an emdash`}
      />
      {/* tslint:disable-next-line: jsx-curly-brace-presence */}
      <ReadMore maxChars={30} content={`Line break\n\nWhich should render an emdash`} />
    </List>
  ))
