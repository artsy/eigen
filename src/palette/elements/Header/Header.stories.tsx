import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withTheme } from "storybook/decorators"
import { ArtsyLogoHeader } from "./ArtsyLogoHeader"

storiesOf("Headers", module)
  .addDecorator(withTheme)
  .add("Headers", () => (
    <>
      <ArtsyLogoHeader shadow />
      <ArtsyLogoHeader />
    </>
  ))
