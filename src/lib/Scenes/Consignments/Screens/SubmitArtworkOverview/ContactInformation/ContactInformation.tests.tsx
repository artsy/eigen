import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils/"
import { updateConsignSubmission } from "../Mutations"
import { ContactInformationScreen } from "./ContactInformation"
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

describe("ContactInformationForm", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ContactInformationScreen handlePress={() => console.log("do nothing")} />
    </RelayEnvironmentProvider>
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    ;(updateConsignSubmissionMock as jest.Mock).mockClear()
    mockEnvironment.mockClear()
  })

  it("renders without throwing an error", () => {
    renderWithWrappersTL(<TestRenderer />)
  })

  it("renders an empty form if user doesn 't have an account", async () => {
    renderWithWrappersTL(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Query: () => ({
          me: {
            name: "",
            email: "",
            phone: "",
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
          },
        }),
      })
    )
  })

  it("renders correct explanation", async () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Query: () => ({
          me: {
            name: "Angela",
            email: "a@a.aaa",
            phone: "123456789",
            // TODO:
            // Pre-populate phone number from a user's `phoneNumber` field
            // https://artsyproduct.atlassian.net/browse/SWA-224
            // phoneNumber: {
            //   countryCode: "+30",
            //   display: "-",
            //   error: "",
            //   isValid: true,
            //   originalNumber: "23456789",
            //   regionCode: "020",
            // },
          },
        }),
      })
    )

    await flushPromiseQueue()
    expect(
      getByText("We will only use these details to contact you regarding your submission.")
    ).toBeTruthy()
  })

  // TODO: (related Jira ticket: https://artsyproduct.atlassian.net/browse/SWA-223 )
  //
  // it("renders with an error when something is missing/not properly filled out", async () => null)

  // it("updates existing submission when ID passed", async () => {
  //   // check what is in submission // check all fields are there
  //   // if everything is ok => updateSubmission()
  //   // make sure "userName" exists in submission
  //   // await updateSubmission(mockSubmissionForm, "12345")
  //   // expect updateSubmission to have been called...
  //   // expect(updateConsignSubmissionMock).toHaveBeenCalled()
  // })
  //
  // it("navigate to the next page correctly", () => {
  //   renderWithWrappersTL(<ContactInformation handlePress={() => console.log("do nothing")} />)
  // })
})

export const mockSubmissionForm: ContactInformationFormModel = {
  userName: "Angela",
  userEmail: "a@a.aaa",
  userPhone: "202-555-0174",
}
