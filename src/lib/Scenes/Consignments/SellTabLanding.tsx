import { Theme } from "@artsy/palette"
import React from "react"
import { ConsignmentsHomeQueryRenderer as ConsignmentsHome } from "./v2/Screens/ConsignmentsHome"

export function SellTabLanding() {
  return (
    <Theme>
      <ConsignmentsHome />
    </Theme>
  )
}
