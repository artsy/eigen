import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { UploadPhotos } from "./UploadPhotos"

jest.unmock("react-relay")

const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("UploadPhotos", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <UploadPhotos handlePress={jest.fn()} />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => mockEnvironment.mockClear())

  it("renders correct explanation for upload photos form", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)
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
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
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
      const { UNSAFE_getByProps } = renderWithWrappersTL(<TestRenderer />)
      const SaveButton = UNSAFE_getByProps({
        testID: "Submission_Save_Photos_Button",
      })

      SaveButton.props.onPress()
      await flushPromiseQueue()

      expect(trackEvent).toHaveBeenCalled()
      expect(trackEvent).toHaveBeenCalledWith({
        action: ActionType.uploadPhotosCompleted,
        context_owner_type: OwnerType.consignmentFlow,
        context_module: ContextModule.uploadPhotos,
        submission_id: "54321",
        user_email: "user@mail.com",
        user_id: "1",
      })
    })
  })
})
