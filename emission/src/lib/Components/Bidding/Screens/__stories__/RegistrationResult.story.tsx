import { storiesOf } from "@storybook/react-native"
import React from "react"

// import { BidderPositionResult } from "../../types"
import { RegistrationResult, RegistrationStatus } from "../RegistrationResult"

storiesOf("Bidding")
  .add("Registration Result (pending)", () => {
    return <RegistrationResult status={RegistrationStatus.RegistrationStatusPending} />
  })
  .add("Registration Result (complete)", () => {
    return <RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />
  })
  .add("Registration Result (error)", () => {
    return <RegistrationResult status={RegistrationStatus.RegistrationStatusError} />
  })
