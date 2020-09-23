import { useFormikContext } from "formik"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { AdditionalDetails } from "../AdditionalDetails"

jest.mock("formik")

describe("AdditionalDetails", () => {
  beforeEach(() => {
    const useFormikContextMock = useFormikContext as jest.Mock

    useFormikContextMock.mockImplementation(() => ({
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      values: {
        medium: "Painting",
      },
    }))
  })

  it("renders correct fields", () => {
    const wrapper = renderWithWrappers(<AdditionalDetails />)

    // FIXME: This will change once edition fields are wired up and we show / hide
    // based on overall form state. For now, press and show everything.
    wrapper.root.findByProps({ "data-test-id": "EditionCheckbox" }).props.onPress()

    const fields = [
      "TitleInput",
      "DateInput",
      "EditionCheckbox",
      "EditionNumberInput",
      "EditionSizeInput",
      "MaterialsInput",
      "PricePaidInput",
      "CurrencyInput",
    ]
    fields.forEach((field) => {
      expect(wrapper.root.findByProps({ "data-test-id": field })).toBeDefined()
    })
  })
})
