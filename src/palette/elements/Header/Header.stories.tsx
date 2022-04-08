import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ArtsyLogoHeader } from "./ArtsyLogoHeader"

storiesOf("Headers", module).add("Headers", () => (
  <>
    <ArtsyLogoHeader shadow />
    <ArtsyLogoHeader />
  </>
))
