import { storiesOf } from "@storybook/react-native"
import { ArtsyLogoHeader } from "./ArtsyLogoHeader"

storiesOf("Headers", module).add("Headers", () => (
  <>
    <ArtsyLogoHeader shadow />
    <ArtsyLogoHeader />
  </>
))
