import { storiesOf } from "@storybook/react-native"
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
