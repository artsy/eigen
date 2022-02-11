import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils/"
import { updateConsignSubmission } from "../Mutations"
import { ContactInformationQueryRenderer } from "./ContactInformation"

jest.mock(
  "lib/Scenes/Consignments/Screens/SubmitArtworkOverview/Mutations/updateConsignSubmissionMutation",
  () => ({
    updateConsignSubmission: jest.fn().mockResolvedValue("54321"),
  })
)

const updateConsignSubmissionMock = updateConsignSubmission as jest.Mock

jest.unmock("react-relay")

describe("ContactInformationForm", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
  const handlePressTest = jest.fn()
  const TestRenderer = () => <ContactInformationQueryRenderer handlePress={handlePressTest} />

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

  // it.only("DEBUG", () => {
  //   const { debug } = renderWithWrappersTL(<TestRenderer />)
  //   debug()
  // })
  it.only("Happy path: User can submit information", async () => {
    const { getAllByText, getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)
    updateConsignSubmissionMock.mockResolvedValue("adsfasd")
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Me: () => ({
          ...mockQueryData,
        }),
      })
    )

    await flushPromiseQueue()

    const nameInput = getByPlaceholderText("Your Full Name")
    expect(nameInput).toBeTruthy()
    expect(nameInput).toHaveProp("value", "Angela")

    const emailInput = getByPlaceholderText("Your Email Address")
    expect(emailInput).toBeTruthy()
    expect(emailInput).toHaveProp("value", "a@a.aaa")

    const phoneInput = getByPlaceholderText("(000) 000-0000")
    expect(phoneInput).toBeTruthy()
    expect(phoneInput).toHaveProp("value", "(202) 555-0174")

    expect(getAllByText("Submit Artwork")).toBeTruthy()

    act(() => {
      fireEvent(getAllByText("Submit Artwork")[0], "press")
    })

    expect(updateConsignSubmissionMock).toHaveBeenCalled()
    expect(updateConsignSubmissionMock).toHaveBeenCalledWith({ ...mockFormDataForSubmission })
    await flushPromiseQueue()
    expect(handlePressTest).toHaveBeenCalled()
  })

  // test edge cases - something went wrong

  // TODO: (related Jira ticket: https://artsyproduct.atlassian.net/browse/SWA-223 )
  //
  // it("keeps Submit button deactivated when something is missing/not properly filled out", async () => null)

  // it("updates existing submission when ID passed", async () => {
  //   // check what is in submission // check all fields are there
  //   // if everything is ok => updateSubmission()
  //   // make sure "userName" exists in submission
  //   // await updateSubmission(mockQueryData, "12345")
  //   // expect(updateConsignSubmissionMock).toHaveBeenCalled()
  // })
})

// test phoneNumber:
// isValid returns phone number
// !isValid returns empty string

export const mockQueryData: any = {
  name: "Angela",
  email: "a@a.aaa",
  phoneNumber: { isValid: true, originalNumber: "(202) 555-0174" },
}

export const mockFormDataForSubmission: any = {
  id: "",
  state: "SUBMITTED",
  userEmail: "a@a.aaa",
  userName: "Angela",
  userPhone: "+1 (202) 555-0174",
}
