import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import { GlobalStore } from "app/store/GlobalStore"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils/"
import { updateConsignSubmission } from "../../mutations"
import { STEPS, SubmitSWAArtworkFlow } from "../SubmitArtwork"
import { ContactInformationQueryRenderer } from "./ContactInformation"

jest.mock("../../mutations/updateConsignSubmissionMutation", () => ({
  updateConsignSubmission: jest.fn().mockResolvedValue("54321"),
}))

const updateConsignSubmissionMock = updateConsignSubmission as jest.Mock

jest.unmock("react-relay")

describe("ContactInformationForm", () => {
  afterEach(() => {
    GlobalStore.actions.artworkSubmission.submission.resetSessionState()
  })
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
  const handlePressTest = jest.fn()
  const TestRenderer = ({ isLastStep = true }: { isLastStep?: boolean }) => (
    <ContactInformationQueryRenderer handlePress={handlePressTest} isLastStep={isLastStep} />
  )

  it("renders without throwing an error", () => {
    renderWithWrappers(
      <ContactInformationQueryRenderer handlePress={() => console.log("do nothing")} isLastStep />
    )
  })

  it("renders Form instructions", () => {
    const { findByText } = renderWithWrappers(<TestRenderer />)

    expect(
      findByText("We will only use these details to contact you regarding your submission.")
    ).toBeTruthy()
  })

  it("Happy path: User can submit information", async () => {
    GlobalStore.actions.artworkSubmission.submission.setSubmissionId(mockFormDataForSubmission.id)

    const { queryByText, getByText, getByPlaceholderText } = renderWithWrappers(
      <SubmitSWAArtworkFlow
        navigation={jest.fn() as any}
        stepsInOrder={[STEPS.ContactInformation]}
      />
    )

    await flushPromiseQueue()

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
    expect(updateConsignSubmissionMock).toHaveBeenCalledWith(
      expect.objectContaining(mockFormDataForSubmission)
    )
  })

  it("Keeps Submit button deactivated when something is missing/not properly filled out. Gets enabled if everything is filled out.", async () => {
    const { getByText, getByPlaceholderText } = renderWithWrappers(<TestRenderer />)
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
      const { getByText, getByPlaceholderText } = renderWithWrappers(<TestRenderer />)
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
      const { getByText, getByPlaceholderText } = renderWithWrappers(<TestRenderer />)
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
  })

  describe("analytics", () => {
    let trackEvent: (data: Partial<{}>) => void
    beforeEach(() => {
      trackEvent = useTracking().trackEvent
      GlobalStore.actions.auth.setState({
        userID: "my-id",
      })
    })

    afterEach(() => {
      GlobalStore.actions.auth.setState({
        userID: null,
      })
    })

    it("tracks uploadPhotosCompleted event on save", async () => {
      const { getByTestId } = renderWithWrappers(
        <SubmitSWAArtworkFlow
          navigation={jest.fn() as any}
          stepsInOrder={[
            STEPS.ContactInformation,
            // Add a random step so that STEPS.ContactInformation is not the last step
            STEPS.ArtworkDetails,
          ]}
        />
      )

      await flushPromiseQueue()

      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Me: () => ({
            ...mockQueryData,
          }),
        })
      )

      await flushPromiseQueue()

      const contactInfoCTA = getByTestId("Submission_ContactInformation_Button")
      fireEvent.press(contactInfoCTA)

      await flushPromiseQueue()

      mockEnvironment.mock.resolveMostRecentOperation((operation) => {
        return MockPayloadGenerator.generate(operation, {
          consignmentSubmission: () => ({
            internalID: "54321",
          }),
        })
      })

      await flushPromiseQueue()

      expect(trackEvent).toHaveBeenCalled()
      expect(trackEvent).toHaveBeenCalledWith({
        action: ActionType.contactInformationCompleted,
        context_owner_type: OwnerType.consignmentFlow,
        context_module: ContextModule.contactInformation,
        submission_id: '<mock-value-for-field-"internalID">',
        user_email: mockQueryData.email,
        user_id: "my-id",
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
  id: "54321",
  userEmail: "a@a.aaa",
  userName: "Angela",
  userPhone: "+1 (202) 555-0174",
}
