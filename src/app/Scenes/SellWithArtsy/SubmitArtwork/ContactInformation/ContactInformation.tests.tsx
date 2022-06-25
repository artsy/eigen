import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils/"
import { updateConsignSubmission } from "../../mutations"
import { ContactInformationQueryRenderer } from "./ContactInformation"

jest.mock("../../mutations/updateConsignSubmissionMutation", () => ({
  updateConsignSubmission: jest.fn().mockResolvedValue("54321"),
}))

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
    const { findByText } = renderWithWrappersTL(<TestRenderer />)

    expect(
      findByText("We will only use these details to contact you regarding your submission.")
    ).toBeTruthy()
  })

  it("Happy path: User can submit information", async () => {
    const { queryByText, getByText, getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)
    updateConsignSubmissionMock.mockResolvedValue("adsfasd")
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Me: () => ({
          ...mockQueryData,
        }),
      })
    )

    await flushPromiseQueue()

    const inputs = {
      nameInput: getByPlaceholderText("Your full name"),
      emailInput: getByPlaceholderText("Your email address"),
      phoneInput: getByPlaceholderText("(000) 000-0000"),
    }

    expect(inputs.nameInput).toBeTruthy()
    expect(inputs.nameInput).toHaveProp("value", "Angela")

    expect(inputs.emailInput).toBeTruthy()
    expect(inputs.emailInput).toHaveProp("value", "a@a.aaa")

    expect(inputs.phoneInput).toBeTruthy()
    expect(inputs.phoneInput).toHaveProp("value", "(202) 555-0174")

    expect(queryByText("Submit Artwork")).toBeTruthy()

    fireEvent.press(getByText("Submit Artwork"))

    await flushPromiseQueue()

    expect(updateConsignSubmissionMock).toHaveBeenCalled()
    expect(updateConsignSubmissionMock).toHaveBeenCalledWith({ ...mockFormDataForSubmission })

    await flushPromiseQueue()

    expect(handlePressTest).toHaveBeenCalled()
  })

  it("Keeps Submit button deactivated when something is missing/not properly filled out. Gets enabled if everything is filled out.", async () => {
    const { getByText, getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)
    updateConsignSubmissionMock.mockResolvedValue("adsfasd")
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Me: () => ({
          ...mockQueryDataInfoMissing,
        }),
      })
    )
    const inputs = {
      nameInput: getByPlaceholderText("Your full name"),
      emailInput: getByPlaceholderText("Your email address"),
      phoneInput: getByPlaceholderText("(000) 000-0000"),
    }

    const submitButton = getByText("Submit Artwork")

    await flushPromiseQueue()

    expect(submitButton).toBeDisabled()

    fireEvent.changeText(inputs.nameInput, "Angelika")
    fireEvent.changeText(inputs.emailInput, "aa@aa.aaa")
    fireEvent.changeText(inputs.phoneInput, "2025550155")

    await flushPromiseQueue()

    expect(submitButton).not.toBeDisabled()
  })

  describe("validation", () => {
    it("displays error message for name", async () => {
      const { getByText, getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Me: () => ({
            ...mockQueryData,
          }),
        })
      )

      await flushPromiseQueue()

      const inputs = {
        nameInput: getByPlaceholderText("Your full name"),
        emailInput: getByPlaceholderText("Your email address"),
      }

      fireEvent.changeText(inputs.nameInput, "a")
      fireEvent.changeText(inputs.emailInput, "aa")

      await flushPromiseQueue()

      expect(getByText("Please enter your full name.")).toBeTruthy()
    })

    it("displays error message for email address", async () => {
      const { getByText, getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Me: () => ({
            ...mockQueryData,
          }),
        })
      )

      await flushPromiseQueue()

      const inputs = {
        emailInput: getByPlaceholderText("Your email address"),
        phoneInput: getByPlaceholderText("(000) 000-0000"),
      }

      fireEvent.changeText(inputs.emailInput, "aa")
      fireEvent.changeText(inputs.phoneInput, "12")

      await flushPromiseQueue()

      expect(getByText("Please enter a valid email address.")).toBeTruthy()
    })

    it("displays error message for phone number", async () => {
      const { getByText, getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Me: () => ({
            ...mockQueryData,
          }),
        })
      )

      await flushPromiseQueue()

      const inputs = {
        emailInput: getByPlaceholderText("Your email address"),
        phoneInput: getByPlaceholderText("(000) 000-0000"),
      }

      fireEvent.changeText(inputs.phoneInput, "12")
      fireEvent.changeText(inputs.emailInput, "aa")

      await flushPromiseQueue()

      expect(getByText("Please enter a valid phone number.")).toBeTruthy()
    })
  })

  describe("analytics", () => {
    let trackEvent: (data: Partial<{}>) => void
    beforeEach(() => {
      trackEvent = useTracking().trackEvent
      GlobalStore.actions.artworkSubmission.submission.setSubmissionId("54321")
      GlobalStore.actions.auth.setState({
        userID: "1",
      })
    })

    afterEach(() => {
      GlobalStore.actions.artworkSubmission.submission.resetSessionState()
      GlobalStore.actions.auth.setState({
        userID: null,
      })
    })

    it("tracks consignmentSubmitted event on save", async () => {
      const { getByText } = renderWithWrappersTL(<TestRenderer />)
      updateConsignSubmissionMock.mockResolvedValue("54321")
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Me: () => ({
            ...mockQueryData,
          }),
        })
      )

      await flushPromiseQueue()

      fireEvent.press(getByText("Submit Artwork"))

      await flushPromiseQueue()

      expect(trackEvent).toHaveBeenCalled()
      expect(trackEvent).toHaveBeenCalledWith({
        action: ActionType.consignmentSubmitted,
        context_owner_type: OwnerType.consignmentFlow,
        context_module: ContextModule.contactInformation,
        submission_id: "54321",
        user_email: "a@a.aaa",
        user_id: "1",
      })
    })
  })
})

export const mockQueryData: any = {
  name: "Angela",
  email: "a@a.aaa",
  phoneNumber: { isValid: true, originalNumber: "+1 (202) 555-0174" },
}

export const mockQueryDataInfoMissing: any = {
  name: "",
  email: "",
  phoneNumber: { isValid: false, originalNumber: "" },
}

export const mockFormDataForSubmission: any = {
  id: "",
  state: "SUBMITTED",
  userEmail: "a@a.aaa",
  userName: "Angela",
  userPhone: "+1 (202) 555-0174",
}
