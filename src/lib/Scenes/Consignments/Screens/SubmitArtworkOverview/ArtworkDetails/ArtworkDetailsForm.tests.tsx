import { fireEvent } from "@testing-library/react-native"
import { Formik } from "formik"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { CTAButton } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { limitedEditionValue } from "../utils/rarityOptions"
import { artworkDetailsValidationSchema } from "../utils/validation"
import { ArtworkDetailsForm, ArtworkDetailsFormModel } from "./ArtworkDetailsForm"

jest.unmock("react-relay")

const ArtworkDetailsFormTestRenderer: React.FC<{ rarity?: string }> = ({ rarity }) => {
  return (
    <Formik<ArtworkDetailsFormModel>
      initialValues={{
        ...mockArtworkDetailsFormValues,
        rarity: rarity || "unique",
      }}
      onSubmit={jest.fn()}
      validationSchema={artworkDetailsValidationSchema}
      validateOnMount
    >
      {({ isValid }) => (
        <>
          <ArtworkDetailsForm />
          <CTAButton disabled={!isValid} onPress={jest.fn()} testID="Consignment_ArtworkDetails_Button">
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
      title: getByTestId("Consignment_TitleInput"),
      year: getByTestId("Consignment_YearInput"),
      material: getByTestId("Consignment_MaterialsInput"),
      height: getByTestId("Consignment_HeightInput"),
      width: getByTestId("Consignment_WidthInput"),
      depth: getByTestId("Consignment_DepthInput"),
      provenance: getByTestId("Consignment_ProvenanceInput"),
      location: getByTestId("Consignment_LocationInput"),
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
    const { getByTestId } = renderWithWrappersTL(<ArtworkDetailsFormTestRenderer rarity={limitedEditionValue} />)

    const inputs = {
      editionNumber: getByTestId("Consignment_EditionNumberInput"),
      editionSize: getByTestId("Consignment_EditionSizeInput"),
    }

    expect(inputs.editionNumber).toBeTruthy()
    expect(inputs.editionSize).toBeTruthy()
  })
})

const mockArtworkDetailsFormValues = {
  artist: "caspar david friedrich",
  artistId: "123",
  title: "work",
  year: "1820",
  materials: "oil on canvas",
  editionNumber: "1",
  editionSizeFormatted: "1",
  units: "in",
  height: "100",
  width: "200",
  depth: "3",
  provenance: "acquired",
  location: "",
  state: "DRAFT",
  utmMedium: "",
  utmSource: "",
  utmTerm: "",
}
