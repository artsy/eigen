import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { STEPS, SubmitSWAArtworkFlow } from "app/Scenes/SellWithArtsy/SubmitArtwork/SubmitArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { UploadPhotos } from "./UploadPhotos"


const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("UploadPhotos", () => {
  const TestRenderer = ({ isLastStep = false }: { isLastStep?: boolean }) => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <UploadPhotos handlePress={jest.fn()} isLastStep={isLastStep} />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => mockEnvironment.mockClear())

  it("renders correct explanation for upload photos form", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    expect(
      getByText(
        "To evaluate your submission faster, please upload high-quality photos of the work's front and back."
      )
    ).toBeTruthy()

    expect(
      getByText("If possible, include photos of any signatures or certificates of authenticity.")
    ).toBeTruthy()
  })

  it("renders Save and Continue button", () => {
    const { getByTestId } = renderWithWrappers(<TestRenderer />)
    expect(getByTestId("Submission_Save_Photos_Button")).toBeTruthy()
  })

  describe("analytics", () => {
    let trackEvent: (data: Partial<{}>) => void
    beforeEach(() => {
      trackEvent = useTracking().trackEvent

      GlobalStore.actions.artworkSubmission.submission.setSubmissionId("54321")
      GlobalStore.actions.artworkSubmission.submission.setPhotos({
        photos: [
          {
            id: "1",
            geminiToken: "geminiToken",
            path: "./img.png",
            width: 40,
            height: 40,
          },
        ],
      })
      GlobalStore.actions.auth.setState({
        userID: "1",
        userEmail: "user@mail.com",
      })
    })

    afterEach(() => {
      GlobalStore.actions.artworkSubmission.submission.resetSessionState()
      GlobalStore.actions.auth.setState({
        userID: null,
        userEmail: null,
      })
    })

    it("tracks uploadPhotosCompleted event on save", async () => {
      const { UNSAFE_getByProps } = renderWithWrappers(
        <SubmitSWAArtworkFlow navigation={jest.fn() as any} stepsInOrder={[STEPS.UploadPhotos]} />
      )
      const SaveButton = UNSAFE_getByProps({
        testID: "Submission_Save_Photos_Button",
      })

      SaveButton.props.onPress()

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
        action: ActionType.uploadPhotosCompleted,
        context_owner_type: OwnerType.consignmentFlow,
        context_module: ContextModule.uploadPhotos,
        submission_id: '<mock-value-for-field-"internalID">',
        user_email: "user@mail.com",
        user_id: "1",
      })
    })
  })
})
