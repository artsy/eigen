import { ActionType } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import {
  createConsignSubmission,
  updateConsignSubmission,
} from "app/Scenes/SellWithArtsy/mutations"
import { GlobalStore } from "app/store/GlobalStore"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { STEPS, SubmitArtwork, SubmitSWAArtworkFlow } from "./SubmitArtwork"

jest.mock("../mutations/updateConsignSubmissionMutation", () => ({
  updateConsignSubmission: jest.fn().mockResolvedValue("54321"),
}))

jest.mock("../mutations/createConsignSubmissionMutation", () => ({
  createConsignSubmission: jest.fn().mockResolvedValue("54321"),
}))

const updateConsignSubmissionMock = updateConsignSubmission as jest.Mock
const createConsignSubmissionMock = createConsignSubmission as jest.Mock

jest.unmock("react-relay")
describe(SubmitArtwork, () => {
  describe("Steps CTA Buttons", () => {
    it('Displays "Save & Continue" if Accordion Step is not the last and "Submit Artwork" if last', () => {
      const { queryByText: queryByText1 } = renderWithWrappers(
        <SubmitSWAArtworkFlow
          navigation={jest.fn() as any}
          stepsInOrder={[STEPS.ArtworkDetails, STEPS.ContactInformation]}
        />
      )

      expect(queryByText1("Save & Continue")).toBeTruthy()
      expect(queryByText1("Submit Artwork")).toBeFalsy()

      const { queryByText: queryByText2 } = renderWithWrappers(
        <SubmitSWAArtworkFlow
          navigation={jest.fn() as any}
          // when a step is the last
          stepsInOrder={[STEPS.ArtworkDetails]}
        />
      )

      expect(queryByText2("Save & Continue")).toBeFalsy()
      expect(queryByText2("Submit Artwork")).toBeTruthy()
    })
  })

  describe("Submission Flow", () => {
    const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

    afterEach(() => {
      GlobalStore.actions.artworkSubmission.submission.resetSessionState()
    })

    it('state is "DRAFT" if Step that is NOT the last step', async () => {
      const { getByTestId } = renderWithWrappers(
        <SubmitSWAArtworkFlow
          navigation={jest.fn() as any}
          stepsInOrder={[STEPS.ContactInformation, STEPS.UploadPhotos, STEPS.ArtworkDetails]}
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

      const contactInfoCTA = getByTestId("Submission_ContactInformation_Button")
      fireEvent.press(contactInfoCTA)

      await flushPromiseQueue()

      expect(createConsignSubmissionMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ state: "DRAFT" })
      )
    })

    it('state is "SUBMITTED if Step is the last step', async () => {
      const { getByTestId } = renderWithWrappers(
        <SubmitSWAArtworkFlow
          navigation={jest.fn() as any}
          stepsInOrder={[STEPS.ContactInformation]}
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

      const contactInfoCTA = getByTestId("Submission_ContactInformation_Button")
      fireEvent.press(contactInfoCTA)

      await flushPromiseQueue()

      expect(createConsignSubmissionMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ state: "SUBMITTED" })
      )
    })

    it("tracks consignmentSubmittedEvent only if consignment was SUBMITTED", async () => {
      const trackEvent = useTracking().trackEvent
      createConsignSubmissionMock.mockResolvedValue("54321")
      updateConsignSubmissionMock.mockResolvedValue("54321")

      const { getByTestId } = renderWithWrappers(
        <SubmitSWAArtworkFlow
          navigation={jest.fn() as any}
          stepsInOrder={[STEPS.ContactInformation]}
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

      const contactInfoCTA = getByTestId("Submission_ContactInformation_Button")
      fireEvent.press(contactInfoCTA)

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

      const { getByTestId } = renderWithWrappers(
        <SubmitSWAArtworkFlow
          navigation={jest.fn() as any}
          stepsInOrder={[STEPS.ContactInformation, STEPS.UploadPhotos]}
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

      const contactInfoCTA = getByTestId("Submission_ContactInformation_Button")
      fireEvent.press(contactInfoCTA)

      await flushPromiseQueue()

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
    const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

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

      const { getByTestId } = renderWithWrappers(
        <SubmitSWAArtworkFlow
          navigation={jest.fn() as any}
          stepsInOrder={[STEPS.ContactInformation]}
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

      const contactInfoCTA = getByTestId("Submission_ContactInformation_Button")
      fireEvent.press(contactInfoCTA)

      await flushPromiseQueue()

      expect(addClueSpy).not.toHaveBeenCalled()
    })

    it("addClue ArtworkSubmissionMessage when submitting other Artworks that are not MyCollectionArtwork", async () => {
      GlobalStore.actions.artworkSubmission.submission.initializeArtworkDetailsForm({
        myCollectionArtworkID: null,
      })

      const { getByTestId } = renderWithWrappers(
        <SubmitSWAArtworkFlow
          navigation={jest.fn() as any}
          stepsInOrder={[STEPS.ContactInformation]}
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

      const contactInfoCTA = getByTestId("Submission_ContactInformation_Button")
      fireEvent.press(contactInfoCTA)

      await flushPromiseQueue()

      expect(addClueSpy).toHaveBeenCalledWith("ArtworkSubmissionMessage")
    })
  })
})
