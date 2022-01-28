import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils/"
import { createConsignSubmission, updateConsignSubmission } from "../Mutations"

import { ContactInformation } from "./ContactInformation"

jest.mock(
  "lib/Scenes/Consignments/Screens/SubmitArtworkOverview/Mutations/updateConsignSubmissionMutation",
  () => ({
    updateConsignSubmission: jest.fn().mockResolvedValue("54321"),
  })
)

jest.mock("lib/relay/createEnvironment", () => {
  return {
    defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
  }
})

jest.unmock("react-relay")

const createConsignSubmissionMock = createConsignSubmission as jest.Mock
const updateConsignSubmissionMock = updateConsignSubmission as jest.Mock
const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("ArtworkDetailsForm", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ContactInformation handlePress={jest.fn()} />
    </RelayEnvironmentProvider>
  )

  it("renders without throwing an error", () => {
    renderWithWrappersTL(<ContactInformation handlePress={() => console.log("do nothing")} />)
  })
  it("sends information correctly", () => {
    renderWithWrappersTL(<ContactInformation handlePress={() => console.log("do nothing")} />)
  })
  it(" navigate to the next page correctly", () => {
    renderWithWrappersTL(<ContactInformation handlePress={() => console.log("do nothing")} />)
  })
})
