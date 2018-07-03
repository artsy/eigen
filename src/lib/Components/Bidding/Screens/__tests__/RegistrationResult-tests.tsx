import React from "react"
import * as renderer from "react-test-renderer"

import { RegistrationResult, RegistrationStatus } from "../RegistrationResult"

describe("Registration result component", () => {
  it("renders registration pending properly", () => {
    const component = renderer
      .create(<RegistrationResult status={RegistrationStatus.RegistrationStatusPending} />)
      .toJSON()
    expect(component).toMatchSnapshot()
  })
  it("renders registration complete properly", () => {
    const component = renderer
      .create(<RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />)
      .toJSON()
    expect(component).toMatchSnapshot()
  })
  it("renders registration error properly", () => {
    const component = renderer
      .create(<RegistrationResult status={RegistrationStatus.RegistrationStatusError} />)
      .toJSON()
    expect(component).toMatchSnapshot()
  })
})
