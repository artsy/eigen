import React from "react"
import { Boot } from "./Boot"
import { ConsignmentsHomeQueryRenderer as ConsignmentsHome } from "./Screens/ConsignmentsHome"

export const SellTabLanding: React.FC = () => {
  return (
    <Boot>
      <ConsignmentsHome />
    </Boot>
  )
}
