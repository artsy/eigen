import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { createConsignSubmission, updateConsignSubmission } from "../Mutations"
import { ArtworkDetails } from "./ArtworkDetails"
import { createOrUpdateSubmission } from "./utils/createOrUpdateSubmission"
import { mockFormValues } from "./utils/testUtils"

jest.mock(
  "lib/Scenes/Consignments/Screens/SubmitArtworkOverview/Mutations/createConsignSubmissionMutation",
  () => ({
    createConsignSubmission: jest.fn().mockResolvedValue("12345"),
  })
)

jest.mock(
  "lib/Scenes/Consignments/Screens/SubmitArtworkOverview/Mutations/updateConsignSubmissionMutation",
  () => ({
    updateConsignSubmission: jest.fn().mockResolvedValue("54321"),
  })
)

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

  beforeEach(() => {
    ;(createConsignSubmissionMock as jest.Mock).mockClear()
    ;(updateConsignSubmissionMock as jest.Mock).mockClear()
  })

  afterEach(() => jest.clearAllMocks())

  it("renders correct explanation for form fields", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)
    expect(getByText("All fields are required to submit an artwork.")).toBeTruthy()
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
      act(() => fireEvent.changeText(inputs.title, ""))
      expect(SaveButton.props.disabled).toBe(true)

      // year missing
      act(() => {
        fireEvent.changeText(inputs.year, "")
        fireEvent.changeText(inputs.title, "someTitle")
      })
      expect(SaveButton.props.disabled).toBe(true)

      // material missing
      act(() => {
        fireEvent.changeText(inputs.material, "")
        fireEvent.changeText(inputs.year, "1999")
      })
      expect(SaveButton.props.disabled).toBe(true)

      // height missing
      act(() => {
        fireEvent.changeText(inputs.height, "")
        fireEvent.changeText(inputs.material, "oil on c")
      })
      expect(SaveButton.props.disabled).toBe(true)

      // width missing
      act(() => {
        fireEvent.changeText(inputs.width, "")
        fireEvent.changeText(inputs.height, "123")
      })
      expect(SaveButton.props.disabled).toBe(true)

      // depth missing
      act(() => {
        fireEvent.changeText(inputs.depth, "")
        fireEvent.changeText(inputs.width, "123")
      })

      expect(SaveButton.props.disabled).toBe(true)

      // provenance missing
      act(() => {
        fireEvent.changeText(inputs.provenance, "")
        fireEvent.changeText(inputs.depth, "123")
      })

      expect(SaveButton.props.disabled).toBe(true)

      act(() => {
        fireEvent.changeText(inputs.provenance, "found it")
      })
    })
  })
})
