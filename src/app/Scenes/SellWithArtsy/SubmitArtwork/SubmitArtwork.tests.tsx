import { ActionType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import {
  createConsignSubmission,
  updateConsignSubmission,
} from "app/Scenes/SellWithArtsy/mutations"
import { GlobalStore } from "app/store/GlobalStore"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useTracking } from "react-tracking"
import { MockPayloadGenerator, createMockEnvironment } from "relay-test-utils"
import { STEPS, SubmitArtwork, SubmitSWAArtworkFlow } from "./SubmitArtwork"

jest.mock("../mutations/updateConsignSubmissionMutation", () => ({
  updateConsignSubmission: jest.fn().mockResolvedValue("54321"),
}))

jest.mock("../mutations/createConsignSubmissionMutation", () => ({
  createConsignSubmission: jest.fn().mockResolvedValue("54321"),
}))

const updateConsignSubmissionMock = updateConsignSubmission as jest.Mock
const createConsignSubmissionMock = createConsignSubmission as jest.Mock

describe(SubmitArtwork, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
  })

  describe("Steps CTA Buttons", () => {
    it('Displays "Save & Continue" if Accordion Step is not the last and "Submit Artwork" if last', () => {
      renderWithWrappers(
        <SubmitSWAArtworkFlow
          navigation={jest.fn() as any}
          stepsInOrder={[STEPS.ArtworkDetails, STEPS.UploadPhotos]}
        />
      )

      expect(screen.getByText("Save & Continue")).toBeTruthy()
      expect(screen.queryByText("Submit Artwork")).toBeFalsy()

      renderWithWrappers(
        <SubmitSWAArtworkFlow
          navigation={jest.fn() as any}
          // when a step is the last
          stepsInOrder={[STEPS.ArtworkDetails]}
        />
      )

      expect(screen.queryByText("Save & Continue")).toBeFalsy()
      expect(screen.getByText("Submit Artwork")).toBeTruthy()
    })
  })

  const fillStep1 = async () => {
    renderWithWrappers(
      <SubmitSWAArtworkFlow
        navigation={jest.fn() as any}
        stepsInOrder={[STEPS.ArtworkDetails, STEPS.UploadPhotos]}
      />
    )

    await flushPromiseQueue()

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Me: () => ({
          name: "User",
          email: "user@user.com",
          phoneNumber: { isValid: true, originalNumber: "+49 1753627282" },
        }),
      })
    )

    await flushPromiseQueue()

    const inputs = {
      artist: screen.getByTestId("Submission_ArtistInput"),
      title: screen.getByTestId("Submission_TitleInput"),
      year: screen.getByTestId("Submission_YearInput"),
      material: screen.getByTestId("Submission_MaterialsInput"),
      height: screen.getByTestId("Submission_HeightInput"),
      width: screen.getByTestId("Submission_WidthInput"),
      depth: screen.getByTestId("Submission_DepthInput"),
      provenance: screen.getByTestId("Submission_ProvenanceInput"),
    }

    await flushPromiseQueue()

    fireEvent.changeText(inputs.artist, "Banksy")

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        SearchableConnection() {
          return {
            edges: [
              {
                node: {
                  internalID: "banksy-internal-id",
                  displayLabel: "Banksy",
                  imageUrl: "banksy-image-url",
                },
              },
            ],
          }
        },
      })
    )

    await flushPromiseQueue()
    fireEvent.press(screen.getByTestId("artist-suggestion-banksy-internal-id"))

    fireEvent.changeText(inputs.title, "someTitle")

    fireEvent.changeText(inputs.year, "1999")

    fireEvent.press(screen.getByTestId("CategorySelect"))
    await flushPromiseQueue()
    fireEvent.press(screen.getByText("Painting"))

    fireEvent.press(screen.getByTestId("Submission_RaritySelect"))
    await flushPromiseQueue()
    fireEvent.press(screen.getByText("Unique"))

    fireEvent.changeText(inputs.material, "oil on c")

    fireEvent.changeText(inputs.height, "123")

    fireEvent.changeText(inputs.width, "123")

    fireEvent.changeText(inputs.provenance, "friends")
    fireEvent.changeText(inputs.depth, "123")
  }

  describe("Submission Flow", () => {
    afterEach(() => {
      GlobalStore.actions.artworkSubmission.submission.resetSessionState()
    })

    it('state is "DRAFT" if Step that is NOT the last step', async () => {
      await fillStep1()

      await flushPromiseQueue()

      const saveAndContinueButton = screen.getByTestId("Submission_ArtworkDetails_Button")

      fireEvent.press(saveAndContinueButton)

      expect(createConsignSubmissionMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ state: "DRAFT" })
      )
    })

    it('state is "SUBMITTED if Step is the last step', async () => {
      await fillStep1()

      await flushPromiseQueue()

      const saveAndContinueButton = screen.getByTestId("Submission_ArtworkDetails_Button")

      fireEvent.press(saveAndContinueButton)

      expect(createConsignSubmissionMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ state: "DRAFT" })
      )
      await flushPromiseQueue()

      fireEvent.press(screen.getByTestId("Submission_Save_Photos_Button"))

      expect(updateConsignSubmissionMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ state: "SUBMITTED" })
      )
    })

    it("tracks consignmentSubmittedEvent only if consignment was SUBMITTED", async () => {
      const trackEvent = useTracking().trackEvent
      createConsignSubmissionMock.mockResolvedValue("54321")
      updateConsignSubmissionMock.mockResolvedValue("54321")

      await fillStep1()

      await flushPromiseQueue()

      const saveAndContinueButton = screen.getByTestId("Submission_ArtworkDetails_Button")

      fireEvent.press(saveAndContinueButton)

      expect(createConsignSubmissionMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ state: "DRAFT" })
      )
      await flushPromiseQueue()

      fireEvent.press(screen.getByTestId("Submission_Save_Photos_Button"))

      expect(updateConsignSubmissionMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ state: "SUBMITTED" })
      )
      await flushPromiseQueue()

      expect(trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ActionType.consignmentSubmitted,
        })
      )
    })

    it("Does not track consignmentSubmittedEvent if consignment is DRAFT", async () => {
      const trackEvent = useTracking().trackEvent
      createConsignSubmissionMock.mockResolvedValue("54321")
      updateConsignSubmissionMock.mockResolvedValue("54321")

      await fillStep1()

      await flushPromiseQueue()

      const saveAndContinueButton = screen.getByTestId("Submission_ArtworkDetails_Button")

      fireEvent.press(saveAndContinueButton)

      expect(createConsignSubmissionMock).toHaveBeenCalledWith(
        expect.objectContaining({ state: "DRAFT" })
      )
      expect(trackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({
          action: ActionType.consignmentSubmitted,
        })
      )
    })
  })

  describe("Submission VisualClues", () => {
    let addClueSpy = jest
      .spyOn(GlobalStore.actions.visualClue, "addClue")
      .mockImplementation(() => null)
    beforeEach(() => {
      addClueSpy = jest
        .spyOn(GlobalStore.actions.visualClue, "addClue")
        .mockImplementation(() => null)
    })
    afterEach(() => {
      GlobalStore.actions.artworkSubmission.submission.resetSessionState()
    })

    it("does not addClue ArtworkSubmissionMessage when submitting MyCollectionArtwork", async () => {
      GlobalStore.actions.artworkSubmission.submission.initializeArtworkDetailsForm({
        myCollectionArtworkID: "my-collection-artwork-id",
      })

      await fillStep1()

      await flushPromiseQueue()

      const saveAndContinueButton = screen.getByTestId("Submission_ArtworkDetails_Button")

      fireEvent.press(saveAndContinueButton)

      expect(createConsignSubmissionMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ state: "DRAFT" })
      )
      await flushPromiseQueue()

      fireEvent.press(screen.getByTestId("Submission_Save_Photos_Button"))

      expect(updateConsignSubmissionMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ state: "SUBMITTED" })
      )
      await flushPromiseQueue()

      expect(addClueSpy).not.toHaveBeenCalled()
    })

    it("addClue ArtworkSubmissionMessage when submitting other Artworks that are not MyCollectionArtwork", async () => {
      GlobalStore.actions.artworkSubmission.submission.initializeArtworkDetailsForm({
        myCollectionArtworkID: null,
      })

      await fillStep1()

      await flushPromiseQueue()

      const saveAndContinueButton = screen.getByTestId("Submission_ArtworkDetails_Button")

      fireEvent.press(saveAndContinueButton)

      expect(createConsignSubmissionMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ state: "DRAFT" })
      )
      await flushPromiseQueue()

      fireEvent.press(screen.getByTestId("Submission_Save_Photos_Button"))

      expect(updateConsignSubmissionMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ state: "SUBMITTED" })
      )
      await flushPromiseQueue()

      expect(addClueSpy).toHaveBeenCalledWith("ArtworkSubmissionMessage")
    })
  })
})
