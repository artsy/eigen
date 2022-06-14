import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { createConsignSubmission, updateConsignSubmission } from "../../mutations"
import { ArtworkDetails } from "./ArtworkDetails"
import { createOrUpdateSubmission } from "./utils/createOrUpdateSubmission"
import { mockFormValues } from "./utils/testUtils"

jest.mock("../../mutations/createConsignSubmissionMutation", () => ({
  createConsignSubmission: jest.fn().mockResolvedValue("12345"),
}))
jest.mock("../../mutations/updateConsignSubmissionMutation", () => ({
  updateConsignSubmission: jest.fn().mockResolvedValue("54321"),
}))

jest.unmock("react-relay")

const createConsignSubmissionMock = createConsignSubmission as jest.Mock
const updateConsignSubmissionMock = updateConsignSubmission as jest.Mock
const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("ArtworkDetails", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ArtworkDetails handlePress={jest.fn()} />
    </RelayEnvironmentProvider>
  )

  afterEach(() => jest.clearAllMocks())

  it("renders correct explanation for form fields", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)
    expect(getByText("Currently, artists can not sell their own work on Artsy.")).toBeTruthy()
    expect(getByText("Learn more.")).toBeTruthy()
    expect(getByText("All fields are required to submit an artwork.")).toBeTruthy()
  })

  it("renders numeric-pad for year and decimal-pad for dimension inputs", async () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    const inputs = {
      year: getByTestId("Submission_YearInput"),
      height: getByTestId("Submission_HeightInput"),
      width: getByTestId("Submission_WidthInput"),
      depth: getByTestId("Submission_DepthInput"),
    }

    await flushPromiseQueue()

    expect(inputs.year.props.keyboardType).toBe("number-pad")
    expect(inputs.height.props.keyboardType).toBe("decimal-pad")
    expect(inputs.width.props.keyboardType).toBe("decimal-pad")
    expect(inputs.depth.props.keyboardType).toBe("decimal-pad")
  })

  describe("createOrUpdateSubmission", () => {
    it("creates new submission when no submission ID passed", async () => {
      await createOrUpdateSubmission(mockFormValues, "")
      expect(createConsignSubmissionMock).toHaveBeenCalled()
    })

    it("updates existing submission when submission ID passed", async () => {
      await createOrUpdateSubmission(mockFormValues, "12345")
      expect(updateConsignSubmissionMock).toHaveBeenCalled()
    })
  })

  describe("Save & Continue button", () => {
    it("corrently rendered", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      expect(getByTestId("Submission_ArtworkDetails_Button")).toBeTruthy()
    })

    it("still corrently rendered when location is set", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

      const locationInput = getByTestId("Submission_LocationInput")
      fireEvent.changeText(locationInput, "Berlin, Germany")

      expect(getByTestId("Submission_ArtworkDetails_Button")).toBeTruthy()
    })

    it("disabled when a required field is missing", async () => {
      const { getByTestId, UNSAFE_getByProps } = renderWithWrappersTL(<TestRenderer />)

      const SaveButton = UNSAFE_getByProps({
        testID: "Submission_ArtworkDetails_Button",
      })

      const inputs = {
        title: getByTestId("Submission_TitleInput"),
        year: getByTestId("Submission_YearInput"),
        material: getByTestId("Submission_MaterialsInput"),
        height: getByTestId("Submission_HeightInput"),
        width: getByTestId("Submission_WidthInput"),
        depth: getByTestId("Submission_DepthInput"),
        provenance: getByTestId("Submission_ProvenanceInput"),
      }

      await flushPromiseQueue()

      // title missing
      fireEvent.changeText(inputs.title, "")
      expect(SaveButton.props.disabled).toBe(true)

      // year missing
      fireEvent.changeText(inputs.year, "")
      fireEvent.changeText(inputs.title, "someTitle")
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
      const { UNSAFE_getByProps } = renderWithWrappersTL(<TestRenderer />)
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
        submission_id: "12345",
        user_email: "user@mail.com",
        user_id: "1",
      })
    })

    it("tracks artworkDetailsCompleted event on submission update", async () => {
      GlobalStore.actions.artworkSubmission.submission.setSubmissionId("54321")
      const { UNSAFE_getByProps } = renderWithWrappersTL(<TestRenderer />)
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
