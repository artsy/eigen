import { fireEvent, waitFor } from "@testing-library/react-native"
import {
  ConsignmentAttributionClass,
  CreateSubmissionMutationInput,
} from "__generated__/createConsignmentSubmissionMutation.graphql"
import { UpdateSubmissionMutationInput } from "__generated__/updateConsignSubmissionMutation.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { createConsignSubmission, updateConsignSubmission } from "../Mutations"
import { createOrUpdateConsignSubmission } from "../utils/createOrUpdateConsignSubmission"
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
      <ArtworkDetails submission={null} handlePress={jest.fn()} />
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

    describe("createOrUpdateConsignSubmission", () => {
      it("creates new submission", async () => {
        await createOrUpdateConsignSubmission(mockSubmissionForm)

        expect(createConsignSubmissionMock).toHaveBeenCalled()
        expect(createConsignSubmissionMock).toHaveBeenCalledWith(mockSubmissionForm)
      })

      it("updates existing submission when ID passed", async () => {
        const mockUpdateSubmissionForm: UpdateSubmissionMutationInput = {
          id: "someId",
          ...mockSubmissionForm,
        }

        await createOrUpdateConsignSubmission(mockUpdateSubmissionForm)

        expect(updateConsignSubmissionMock).toHaveBeenCalled()
        expect(updateConsignSubmissionMock).toHaveBeenCalledWith(mockUpdateSubmissionForm)
      })
    })

    describe("validation", () => {
      it("keeps Save & Continue button disabled until required fields validated", async () => {
        const { getByTestId, UNSAFE_getByProps } = renderWithWrappersTL(<TestRenderer />)

        const SaveButton = UNSAFE_getByProps({
          testID: "Consignment_ArtworkDetails_Button",
        })

        const inputs = {
          title: getByTestId("Consignment_TitleInput"),
          year: getByTestId("Consignment_YearInput"),
          material: getByTestId("Consignment_MaterialsInput"),
          height: getByTestId("Consignment_HeightInput"),
          width: getByTestId("Consignment_WidthInput"),
          depth: getByTestId("Consignment_DepthInput"),
          provenance: getByTestId("Consignment_ProvenanceInput"),
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

const mockSubmissionForm: CreateSubmissionMutationInput = {
  artistID: "123",
  year: "2000",
  title: "artworkTitle",
  medium: "oil on canvas",
  attributionClass: "attributionClass" as ConsignmentAttributionClass,
  editionNumber: "",
  editionSizeFormatted: "",
  height: "100",
  width: "200",
  depth: "3",
  dimensionsMetric: "in",
  provenance: "acquired",
  locationCity: "London, England. UK",
  state: "DRAFT",
  utmMedium: "",
  utmSource: "",
  utmTerm: "",
}
