import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils/"
import { createConsignSubmission, updateConsignSubmission } from "../Mutations"
import { updateSubmission } from "../utils/createOrUpdateSubmission"

import { ContactInformation, ContactInformationFormModel } from "./ContactInformation"

jest.mock(
  "lib/Scenes/Consignments/Screens/SubmitArtworkOverview/Mutations/createConsignSubmissionMutation",
  () => ({
    createConsignSubmission: jest.fn().mockResolvedValue("12345"),
  })
)

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

describe("ContactInformationForm", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ContactInformation handlePress={jest.fn()} />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => {
    ;(createConsignSubmissionMock as jest.Mock).mockClear()
    ;(updateConsignSubmissionMock as jest.Mock).mockClear()
    mockEnvironment.mockClear()
  })

  it("renders without throwing an error", () => {
    renderWithWrappersTL(<ContactInformation handlePress={() => console.log("do nothing")} />)
  })

  it("renders correct explanation for form fields", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)
    expect(
      getByText("We will only use these details to contact you regarding your submission.")
    ).toBeTruthy()
  })

  it("updates existing submission when ID passed", async () => {
    // check what is in submission // check all fields are there
    // if everything is ok => updateSubmission()
    // make sure "userName" exists in submission
    await updateSubmission(mockSubmissionForm, "12345")
    expect(updateConsignSubmissionMock).toHaveBeenCalled()
  })

  // it("navigate to the next page correctly", () => {
  //   renderWithWrappersTL(<ContactInformation handlePress={() => console.log("do nothing")} />)
  // })
})

export const mockSubmissionForm: ContactInformationFormModel = {
  userName: "Angela",
  userEmail: "a@a.aaa",
  userPhone: "202-555-0174",
}
