import { fireEvent } from "@testing-library/react-native"
import { Formik } from "formik"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { CTAButton } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { limitedEditionValue } from "../utils/rarityOptions"
import { mockSubmissionForm } from "./ArtworkDetails.tests"
import { ArtworkDetailsForm } from "./ArtworkDetailsForm"
import { ArtworkDetailsFormModel, artworkDetailsValidationSchema } from "./validation"

jest.unmock("react-relay")

const ArtworkDetailsFormTestRenderer: React.FC<{ attributionClass?: string }> = ({
  attributionClass,
}) => {
  return (
    <Formik<ArtworkDetailsFormModel>
      initialValues={{
        ...mockSubmissionForm,
        attributionClass: attributionClass || "unique",
      }}
      onSubmit={jest.fn()}
      validationSchema={artworkDetailsValidationSchema}
      validateOnMount
    >
      {({ isValid }) => (
        <>
          <ArtworkDetailsForm />
          <CTAButton
            disabled={!isValid}
            onPress={jest.fn()}
            testID="Submission_ArtworkDetails_Button"
          >
            Save & Continue
          </CTAButton>
        </>
      )}
    </Formik>
  )
}

describe("ArtworkDetailsForm", () => {
  it("mutates typed input values", () => {
    const { getByTestId } = renderWithWrappersTL(<ArtworkDetailsFormTestRenderer />)

    const inputs = {
      title: getByTestId("Submission_TitleInput"),
      year: getByTestId("Submission_YearInput"),
      material: getByTestId("Submission_MaterialsInput"),
      height: getByTestId("Submission_HeightInput"),
      width: getByTestId("Submission_WidthInput"),
      depth: getByTestId("Submission_DepthInput"),
      provenance: getByTestId("Submission_ProvenanceInput"),
      location: getByTestId("Submission_LocationInput"),
    }

    act(() => {
      fireEvent.changeText(inputs.title, "caspar d.")
      fireEvent.changeText(inputs.year, "0001")
      fireEvent.changeText(inputs.material, "litho graph")
      fireEvent.changeText(inputs.height, "1256")
      fireEvent.changeText(inputs.width, "1398")
      fireEvent.changeText(inputs.depth, "3")
      fireEvent.changeText(inputs.provenance, "found")
      fireEvent.changeText(inputs.location, "somewhere")
    })

    expect(inputs.title.props.value).toBe("caspar d.")
    expect(inputs.year.props.value).toBe("0001")
    expect(inputs.material.props.value).toBe("litho graph")
    expect(inputs.height.props.value).toBe("1256")
    expect(inputs.width.props.value).toBe("1398")
    expect(inputs.depth.props.value).toBe("3")
    expect(inputs.provenance.props.value).toBe("found")
    expect(inputs.location.props.value).toBe("somewhere")
  })

  it("when rarity is limited edition, renders additional inputs for edition number and size", () => {
    const { getByTestId } = renderWithWrappersTL(
      <ArtworkDetailsFormTestRenderer attributionClass={limitedEditionValue} />
    )

    const inputs = {
      editionNumber: getByTestId("Submission_EditionNumberInput"),
      editionSize: getByTestId("Submission_EditionSizeInput"),
    }

    expect(inputs.editionNumber).toBeTruthy()
    expect(inputs.editionSize).toBeTruthy()
  })
})
