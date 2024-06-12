import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { STEPS, SubmitSWAArtworkFlow } from "app/Scenes/SellWithArtsy/SubmitArtwork/SubmitArtwork"
import {
  createConsignSubmission,
  updateConsignSubmission,
} from "app/Scenes/SellWithArtsy/mutations"
import { GlobalStore } from "app/store/GlobalStore"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtworkDetails } from "./ArtworkDetails"
import { createOrUpdateSubmission } from "./utils/createOrUpdateSubmission"
import { mockFormValues } from "./utils/testUtils"
import { ArtworkDetailsFormModel, ContactInformationFormModel } from "./validation"

jest.mock("../../mutations/createConsignSubmissionMutation", () => ({
  createConsignSubmission: jest.fn().mockResolvedValue("12345"),
}))
jest.mock("../../mutations/updateConsignSubmissionMutation", () => ({
  updateConsignSubmission: jest.fn().mockResolvedValue("54321"),
}))
jest.mock("./utils/fetchUserContactInformation", () => ({
  fetchUserContactInformation: jest.fn().mockResolvedValue({
    name: "User",
    email: "user@mail.com",
    phoneNumber: { isValid: true, originalNumber: "+49 1753627282" },
  }),
}))

const createConsignSubmissionMock = createConsignSubmission as jest.Mock
const updateConsignSubmissionMock = updateConsignSubmission as jest.Mock

const mockEnvironment = getMockRelayEnvironment()

describe("ArtworkDetails", () => {
  const TestRenderer = ({ isLastStep = false }: { isLastStep?: boolean }) => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ArtworkDetails handlePress={jest.fn()} isLastStep={isLastStep} scrollToTop={jest.fn()} />
    </RelayEnvironmentProvider>
  )

  afterEach(() => jest.clearAllMocks())

  it("renders correct explanation for form fields", () => {
    renderWithWrappers(<TestRenderer />)
    expect(
      screen.getByText(/Currently, artists can not sell their own work on Artsy./)
    ).toBeTruthy()
    expect(screen.getByText("Learn more.")).toBeTruthy()
    expect(screen.getByText("All fields are required to submit an artwork.")).toBeTruthy()
  })

  it("renders numeric-pad for year and decimal-pad for dimension inputs", async () => {
    renderWithWrappers(<TestRenderer />)

    const inputs = {
      year: screen.getByTestId("Submission_YearInput"),
      height: screen.getByTestId("Submission_HeightInput"),
      width: screen.getByTestId("Submission_WidthInput"),
      depth: screen.getByTestId("Submission_DepthInput"),
    }

    await flushPromiseQueue()

    expect(inputs.year.props.keyboardType).toBe("number-pad")
    expect(inputs.height.props.keyboardType).toBe("decimal-pad")
    expect(inputs.width.props.keyboardType).toBe("decimal-pad")
    expect(inputs.depth.props.keyboardType).toBe("decimal-pad")
  })

  describe("createOrUpdateSubmission", () => {
    it("creates new submission when no submission ID passed", async () => {
      await createOrUpdateSubmission(
        mockFormValues as ArtworkDetailsFormModel & ContactInformationFormModel,
        ""
      )
      expect(createConsignSubmissionMock).toHaveBeenCalled()
    })

    it("updates existing submission when submission ID passed", async () => {
      await createOrUpdateSubmission(
        mockFormValues as ArtworkDetailsFormModel & ContactInformationFormModel,
        "12345"
      )
      expect(updateConsignSubmissionMock).toHaveBeenCalled()
    })
  })

  describe("Save & Continue button", () => {
    beforeEach(() => {
      fetchMock.mockResponse(JSON.stringify({ predictions: [] }))
    })

    it("corrently rendered", () => {
      renderWithWrappers(<TestRenderer />)
      expect(screen.getByTestId("Submission_ArtworkDetails_Button")).toBeTruthy()
    })

    it("still corrently rendered when location is set", () => {
      renderWithWrappers(<TestRenderer />)

      const locationInput = screen.getByTestId("autocomplete-location-input")
      fireEvent.changeText(locationInput, "Berlin, Germany")

      expect(screen.getByTestId("Submission_ArtworkDetails_Button")).toBeTruthy()
    })

    it("disabled when a required field is missing", async () => {
      renderWithWrappers(<TestRenderer />)

      const SaveButton = screen.UNSAFE_getByProps({
        testID: "Submission_ArtworkDetails_Button",
      })

      const inputs = {
        title: screen.getByTestId("Submission_TitleInput"),
        year: screen.getByTestId("Submission_YearInput"),
        material: screen.getByTestId("Submission_MaterialsInput"),
        height: screen.getByTestId("Submission_HeightInput"),
        width: screen.getByTestId("Submission_WidthInput"),
        depth: screen.getByTestId("Submission_DepthInput"),
        provenance: screen.getByTestId("Submission_ProvenanceInput"),
      }

      await flushPromiseQueue()

      // All fields missing
      expect(SaveButton.props.disabled).toBe(false)

      // only title available
      fireEvent.changeText(inputs.title, "someTitle")
      await flushPromiseQueue()

      expect(SaveButton.props.disabled).toBe(true)

      // material missing
      fireEvent.changeText(inputs.material, "")
      fireEvent.changeText(inputs.year, "1999")
      expect(SaveButton.props.disabled).toBe(true)
      // height missing
      fireEvent.changeText(inputs.height, "")
      fireEvent.changeText(inputs.material, "oil on c")
      expect(SaveButton.props.disabled).toBe(true)

      // width missing
      fireEvent.changeText(inputs.width, "")
      fireEvent.changeText(inputs.height, "123")
      expect(SaveButton.props.disabled).toBe(true)

      // depth missing
      fireEvent.changeText(inputs.depth, "")
      fireEvent.changeText(inputs.width, "123")
      expect(SaveButton.props.disabled).toBe(true)

      // provenance missing
      fireEvent.changeText(inputs.provenance, "")
      fireEvent.changeText(inputs.depth, "123")
      expect(SaveButton.props.disabled).toBe(true)
    })
  })

  describe("analytics", () => {
    let trackEvent: (data: Partial<{}>) => void
    beforeEach(() => {
      trackEvent = useTracking().trackEvent

      GlobalStore.actions.artworkSubmission.submission.setArtworkDetailsForm(mockFormValues)
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

    it("tracks artworkDetailsCompleted event on submission create", async () => {
      const { UNSAFE_getByProps } = renderWithWrappers(
        <SubmitSWAArtworkFlow navigation={jest.fn() as any} stepsInOrder={[STEPS.ArtworkDetails]} />
      )
      const SaveButton = UNSAFE_getByProps({
        testID: "Submission_ArtworkDetails_Button",
      })

      await flushPromiseQueue()
      SaveButton.props.onPress()
      await flushPromiseQueue()

      expect(trackEvent).toHaveBeenCalled()
      expect(trackEvent).toHaveBeenCalledWith({
        action: ActionType.artworkDetailsCompleted,
        context_owner_type: OwnerType.consignmentFlow,
        context_module: ContextModule.artworkDetails,
        submission_id: "12345",
        user_email: "user@mail.com",
        user_id: "1",
      })
    })

    it("tracks artworkDetailsCompleted event on submission update", async () => {
      GlobalStore.actions.artworkSubmission.submission.setSubmissionId("54321")
      const { UNSAFE_getByProps } = renderWithWrappers(
        <SubmitSWAArtworkFlow navigation={jest.fn() as any} stepsInOrder={[STEPS.ArtworkDetails]} />
      )

      await flushPromiseQueue()
      const SaveButton = UNSAFE_getByProps({
        testID: "Submission_ArtworkDetails_Button",
      })

      SaveButton.props.onPress()
      await flushPromiseQueue()

      expect(trackEvent).toHaveBeenCalled()
      expect(trackEvent).toHaveBeenCalledWith({
        action: ActionType.artworkDetailsCompleted,
        context_owner_type: OwnerType.consignmentFlow,
        context_module: ContextModule.artworkDetails,
        submission_id: "54321",
        user_email: "user@mail.com",
        user_id: "1",
      })
    })
  })
})
