import { fireEvent, waitFor } from "@testing-library/react-native"
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

    it("keeps Save & Continue button disabled until required fields validated", async () => {
      const { getByTestId, UNSAFE_getByProps } = renderWithWrappersTL(<ArtworkDetails handlePress={jest.fn()} />)

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
