import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { STEPS, SubmitSWAArtworkFlow } from "app/Scenes/SellWithArtsy/SubmitArtwork/SubmitArtwork"
import { updateConsignSubmission } from "app/Scenes/SellWithArtsy/mutations"
import { GlobalStore } from "app/store/GlobalStore"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { useTracking } from "react-tracking"
import { MockPayloadGenerator, createMockEnvironment } from "relay-test-utils/"
import { ContactInformationQueryRenderer } from "./ContactInformation"

jest.mock("../../mutations/updateConsignSubmissionMutation", () => ({
  updateConsignSubmission: jest.fn().mockResolvedValue("54321"),
}))

const updateConsignSubmissionMock = updateConsignSubmission as jest.Mock

describe("ContactInformationForm", () => {
  afterEach(() => {
    GlobalStore.actions.artworkSubmission.submission.resetSessionState()
  })

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
  })

  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const handlePressTest = jest.fn()

  const { renderWithRelay } = setupTestWrapper({
    Component: () => <ContactInformationQueryRenderer handlePress={handlePressTest} isLastStep />,
  })

  it("renders Form instructions", () => {
    renderWithRelay({})

    expect(
      screen.getByText("We will only use these details to contact you regarding your submission.")
    ).toBeOnTheScreen()
  })

  it("Happy path: User can submit information", async () => {
    GlobalStore.actions.artworkSubmission.submission.setSubmissionId(mockFormDataForSubmission.id)

    renderWithWrappers(
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
      nameInput: screen.getByTestId("name-input"),
      emailInput: screen.getByTestId("email-input"),
      phoneInput: screen.getByTestId("phone-input"),
    }

    expect(inputs.nameInput).toBeTruthy()
    expect(inputs.nameInput).toHaveProp("value", "Angela")

    expect(inputs.emailInput).toBeTruthy()
    expect(inputs.emailInput).toHaveProp("value", "a@a.aaa")

    expect(inputs.phoneInput).toBeTruthy()
    expect(inputs.phoneInput).toHaveProp("value", "(202) 555-0174")

    expect(screen.getByText("Submit Artwork")).toBeTruthy()

    fireEvent.press(screen.getByText("Submit Artwork"))

    await flushPromiseQueue()

    expect(updateConsignSubmissionMock).toHaveBeenCalled()
    expect(updateConsignSubmissionMock).toHaveBeenCalledWith(
      expect.objectContaining(mockFormDataForSubmission)
    )
  })

  it("Keeps Submit button deactivated when something is missing/not properly filled out. Gets enabled if everything is filled out.", async () => {
    renderWithRelay({
      Me: () => ({
        ...mockQueryDataInfoMissing,
      }),
    })

    const inputs = {
      nameInput: screen.getByTestId("name-input"),
      emailInput: screen.getByTestId("email-input"),
      phoneInput: screen.getByTestId("phone-input"),
    }

    const submitButton = screen.getByText("Submit Artwork")

    await waitFor(() => expect(submitButton).toBeDisabled())

    expect(submitButton).toBeDisabled()

    fireEvent.changeText(inputs.nameInput, "Angelika")
    fireEvent.changeText(inputs.emailInput, "aa@aa.aaa")
    fireEvent.changeText(inputs.phoneInput, "2025550155")

    await waitFor(() => expect(submitButton).toBeEnabled())
  })

  describe("validation", () => {
    it("displays error message for name", async () => {
      renderWithRelay({
        Me: () => ({
          ...mockQueryData,
        }),
      })

      const inputs = {
        nameInput: screen.getByTestId("name-input"),
        emailInput: screen.getByTestId("email-input"),
      }

      fireEvent.changeText(inputs.nameInput, "a")
      fireEvent.changeText(inputs.emailInput, "aa")

      await screen.findByText("Please enter your full name.")
    })

    it("displays error message for email address", async () => {
      renderWithRelay({
        Me: () => ({
          ...mockQueryData,
        }),
      })

      const inputs = {
        emailInput: screen.getByTestId("email-input"),
        phoneInput: screen.getByTestId("phone-input"),
      }

      fireEvent.changeText(inputs.emailInput, "aa")
      fireEvent.changeText(inputs.phoneInput, "12")

      await screen.findByText("Please enter a valid email address.")
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
      renderWithWrappers(
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

      const contactInfoCTA = screen.getByTestId("Submission_ContactInformation_Button")
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
