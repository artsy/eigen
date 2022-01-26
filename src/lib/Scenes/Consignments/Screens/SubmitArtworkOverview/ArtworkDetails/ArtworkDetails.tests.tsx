import { fireEvent, waitFor } from "@testing-library/react-native"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { createConsignSubmission, updateConsignSubmission } from "../Mutations"
import { createOrUpdateSubmission } from "../utils/createOrUpdateSubmission"
import { ArtworkDetailsFormModel } from "../utils/validation"
import { ArtworkDetails } from "./ArtworkDetails"

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

jest.mock("lib/relay/createEnvironment", () => {
  return {
    defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
  }
})

jest.unmock("react-relay")

const createConsignSubmissionMock = createConsignSubmission as jest.Mock
const updateConsignSubmissionMock = updateConsignSubmission as jest.Mock
const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("ArtworkDetailsForm", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ArtworkDetails handlePress={jest.fn()} />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => {
    ;(createConsignSubmissionMock as jest.Mock).mockClear()
    ;(updateConsignSubmissionMock as jest.Mock).mockClear()
    mockEnvironment.mockClear()
  })

  describe("ArtworkDetails", () => {
    it("renders correct explanation for form fields", () => {
      const { getByText } = renderWithWrappersTL(<TestRenderer />)
      expect(getByText("• All fields are required to submit an artwork.")).toBeTruthy()
    })

    describe("createOrUpdateSubmission", () => {
      it("creates new submission", async () => {
        await createOrUpdateSubmission(mockSubmissionForm, "")
        expect(createConsignSubmissionMock).toHaveBeenCalled()
      })

      it("updates existing submission when ID passed", async () => {
        await createOrUpdateSubmission(mockSubmissionForm, "12345")
        expect(updateConsignSubmissionMock).toHaveBeenCalled()
      })
    })

    describe("validation", () => {
      it("keeps Save & Continue button disabled until required fields validated", async () => {
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

        // title missing
        await waitFor(() => act(() => fireEvent.changeText(inputs.title, "")))
        expect(SaveButton.props.disabled).toBe(true)

        // year missing
        await waitFor(() => {
          act(() => {
            fireEvent.changeText(inputs.year, "")
            fireEvent.changeText(inputs.title, "someTitle")
          })
        })
        expect(SaveButton.props.disabled).toBe(true)

        // material missing
        await waitFor(() => {
          act(() => {
            fireEvent.changeText(inputs.material, "")
            fireEvent.changeText(inputs.year, "1999")
          })
        })
        expect(SaveButton.props.disabled).toBe(true)

        // height missing
        await waitFor(() => {
          act(() => {
            fireEvent.changeText(inputs.height, "")
            fireEvent.changeText(inputs.material, "oil on c")
          })
        })
        expect(SaveButton.props.disabled).toBe(true)

        // width missing
        await waitFor(() => {
          act(() => {
            fireEvent.changeText(inputs.width, "")
            fireEvent.changeText(inputs.height, "123")
          })
        })
        expect(SaveButton.props.disabled).toBe(true)

        // depth missing
        await waitFor(() => {
          act(() => {
            fireEvent.changeText(inputs.depth, "")
            fireEvent.changeText(inputs.width, "123")
          })
        })
        expect(SaveButton.props.disabled).toBe(true)

        // provenance missing
        await waitFor(() => {
          act(() => {
            fireEvent.changeText(inputs.provenance, "")
            fireEvent.changeText(inputs.depth, "123")
          })
        })
        expect(SaveButton.props.disabled).toBe(true)
      })
    })
  })
})

const mockSubmissionForm: ArtworkDetailsFormModel = {
  artist: "123",
  artistId: "200",
  title: "hello",
  year: "2000",
  medium: "oil",
  attributionClass: "attributionClass",
  editionNumber: "1",
  editionSizeFormatted: "1",
  dimensionsMetric: "in",
  height: "2",
  width: "2",
  depth: "2",
  provenance: "found",
  state: "DRAFT",
  utmMedium: "",
  utmSource: "",
  utmTerm: "",
  location: {
    city: "London",
    state: "England",
    country: "UK",
  },
}
