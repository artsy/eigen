import { ProvideScreenTracking, Schema } from "lib/utils/track"
import React from "react"
import { ConsignmentsHomeQueryRenderer } from "./Screens/ConsignmentsHome/ConsignmentsHome"

export const SellTabApp: React.FC = () => {
  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.Sell,
        context_screen_owner_type: null,
      }}
    >
      <ConsignmentsHomeQueryRenderer />
    </ProvideScreenTracking>
  )
}
