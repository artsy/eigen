import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils/"
import { updateConsignSubmission } from "../Mutations"
import { ContactInformationQueryRenderer } from "./ContactInformation"
import { ContactInformationFormModel } from "./validation"

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

const updateConsignSubmissionMock = updateConsignSubmission as jest.Mock
const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("ContactInformationForm", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ContactInformationQueryRenderer handlePress={jest.fn()} />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => {
    ;(updateConsignSubmissionMock as jest.Mock).mockClear()
    mockEnvironment.mockClear()
  })

  it("renders without throwing an error", () => {
    renderWithWrappersTL(
      <ContactInformationQueryRenderer handlePress={() => console.log("do nothing")} />
    )
  })

  it("renders Form instructions", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)
    expect(
      getByText("We will only use these details to contact you regarding your submission.")
    ).toBeTruthy()
  })

  // TODO: (related Jira ticket: https://artsyproduct.atlassian.net/browse/SWA-223 )
  //
  // it("renders with an error when something is missing/not properly filled out", async () => null)
  // it("renders empty form when user isn't logged in or does not have an account", () => {
  //   const { getByText } = renderWithWrappersTL(<TestRenderer />)
  // })

  // it("renders User Information when that exists (user already has an account)", () => {
  //   const { getByText } = renderWithWrappersTL(<TestRenderer />)
  // })

  // it("updates existing submission when ID passed", async () => {
  //   // check what is in submission // check all fields are there
  //   // if everything is ok => updateSubmission()
  //   // make sure "userName" exists in submission
  //   // await updateSubmission(mockSubmissionForm, "12345")
  //   // expect(updateConsignSubmissionMock).toHaveBeenCalled()
  // })

  // it("navigate to the next page correctly", () => {
  //   renderWithWrappersTL(<ContactInformation handlePress={() => console.log("do nothing")} />)
  // })
})

export const mockSubmissionForm: ContactInformationFormModel = {
  userName: "Angela",
  userEmail: "a@a.aaa",
  userPhone: "202-555-0174",
}

// TODO:
// Pre-populate phone number from a user's `phoneNumber` field
// https://artsyproduct.atlassian.net/browse/SWA-224
// phoneNumber: {
//   countryCode: "",
//   display: "",
//   error: "",
//   isValid: true,
//   originalNumber: "",
//   regionCode: "",
// },
