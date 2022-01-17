import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { createConsignSubmission, updateConsignSubmission } from "../Mutations"
import { ArtworkDetails } from "./ArtworkDetails"

// import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
// import { createConsignmentSubmissionMutationResponse } from "__generated__/createConsignmentSubmissionMutation.graphql"
// import { updateConsignSubmissionMutationResponse } from "__generated__/updateConsignSubmissionMutation.graphql"

jest.mock("lib/Scenes/Consignments/Screens/SubmitArtworkOverview/Mutations/createConsignSubmissionMutation", () => ({
  createConsignSubmission: jest.fn(),
}))

jest.mock("lib/Scenes/Consignments/Screens/SubmitArtworkOverview/Mutations/updateConsignSubmissionMutation", () => ({
  updateConsignSubmission: jest.fn(),
}))

jest.mock("lib/relay/createEnvironment", () => {
  return {
    defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
  }
})

jest.unmock("react-relay")

const createConsignSubmissionMock = createConsignSubmission as jest.Mock<any>
const updateConsignSubmissionMock = updateConsignSubmission as jest.Mock<any>
const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("ArtworkDetailsForm", () => {
  beforeEach(() => {
    ;(createConsignSubmissionMock as jest.Mock).mockClear()
    ;(updateConsignSubmissionMock as jest.Mock).mockClear()
    mockEnvironment.mockClear()
  })

  describe("ArtworkDetails", () => {
    it("renders explanation for form fields", () => {
      const { getByText } = renderWithWrappersTL(<ArtworkDetails handlePress={jest.fn()} />)
      expect(getByText("• All fields are required to submit an artwork.")).toBeTruthy()
    })

    it("renders ArtworkDetailsForm with inputs that correctly mutate their respective values", () => {
      const { getByTestId } = renderWithWrappersTL(<ArtworkDetails handlePress={jest.fn()} />)

      // title
      const TitleInput = getByTestId("Consignment_TitleInput")
      expect(TitleInput.props.value).toBe("")
      act(() => fireEvent.changeText(TitleInput, "caspar david"))
      expect(TitleInput.props.value).toBe("caspar david")

      // year
      const YearInput = getByTestId("Consignment_YearInput")
      expect(YearInput.props.value).toBe("")
      act(() => fireEvent.changeText(YearInput, "1812"))
      expect(YearInput.props.value).toBe("1812")

      // material
      const MaterialInput = getByTestId("Consignment_MaterialsInput")
      expect(MaterialInput.props.value).toBe("")
      act(() => fireEvent.changeText(MaterialInput, "Lithograph"))
      expect(MaterialInput.props.value).toBe("Lithograph")

      // height
      const HeightInput = getByTestId("Consignment_HeightSizeInput")
      expect(HeightInput.props.value).toBe("")
      act(() => fireEvent.changeText(HeightInput, "120"))
      expect(HeightInput.props.value).toBe("120")

      // width
      const WidthInput = getByTestId("Consignment_WidthInput")
      expect(WidthInput.props.value).toBe("")
      act(() => fireEvent.changeText(WidthInput, "130"))
      expect(WidthInput.props.value).toBe("130")

      // depth
      const DepthInput = getByTestId("Consignment_DepthInput")
      expect(DepthInput.props.value).toBe("")
      act(() => fireEvent.changeText(DepthInput, "3"))
      expect(DepthInput.props.value).toBe("3")

      // provenance
      const ProvenanceInput = getByTestId("Consignment_ProvenanceInput")
      expect(ProvenanceInput.props.value).toBe("")
      act(() => fireEvent.changeText(ProvenanceInput, "present by x gallery"))
      expect(ProvenanceInput.props.value).toBe("present by x gallery")

      // provenance
      const LocationInput = getByTestId("Consignment_LocationInput")
      expect(LocationInput.props.value).toBe("")
      act(() => fireEvent.changeText(LocationInput, "moscow"))
      expect(LocationInput.props.value).toBe("moscow")
    })

    it("keeps Save button disabled until all required fields validated", () => {
      const { getByTestId } = renderWithWrappersTL(<ArtworkDetails handlePress={jest.fn()} />)
      const SaveButton = getByTestId("Consignment_ArtworkDetails_Button")
      console.log(SaveButton.props)
    })

    it("successfully creates a submission upon Save & Continue click", () => {
      console.log("TODO...")
    })

    it("saves submissionId to AsyncStore", () => {
      console.log("TODO...")
    })

    it("when form is revisited, updates the submission instead of creating another one", () => {
      console.log("TODO...")
    })
  })
})
