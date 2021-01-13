import { useFormikContext } from "formik"
import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { ReactElement } from "simple-markdown"
import { MyCollectionAdditionalDetailsForm } from "../MyCollectionArtworkFormAdditionalDetails"

jest.mock("formik")

describe("MyCollectionArtworkFormAdditionalDetails", () => {
  const useFormikContextMock = useFormikContext as jest.Mock
  let mockAdditionalDetailsForm: ReactElement

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      values: {
        medium: "Painting",
      },
    }))

    const mockNav = jest.fn()
    mockAdditionalDetailsForm = <MyCollectionAdditionalDetailsForm navigation={mockNav as any} />
  })

  it("renders edition form data by default if present", () => {
    useFormikContextMock.mockImplementation(() => ({
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      values: {
        editionSize: "10x30x10",
        editionNumber: "1",
        isEdition: true,
      },
    }))

    const wrapper = renderWithWrappers(mockAdditionalDetailsForm)
    expect(wrapper.root.findByType(Checkbox).props.checked).toBe(true)
    expect(wrapper.root.findByProps({ "data-test-id": "EditionSizeInput" }).props.defaultValue).toBe("10x30x10")
    expect(wrapper.root.findByProps({ "data-test-id": "EditionNumberInput" }).props.defaultValue).toBe("1")
  })

  it("checks the the edition checkbox when checked by user", () => {
    useFormikContextMock.mockImplementation(() => ({
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      values: {},
    }))

    const wrapper = renderWithWrappers(mockAdditionalDetailsForm)
    wrapper.root.findByType(Checkbox).props.onPress()
    expect(wrapper.root.findByType(Checkbox).props.checked).toBe(true)
  })

  it("unchecks the the edition checkbox when unchecked by user", () => {
    useFormikContextMock.mockImplementation(() => ({
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      values: {
        isEdition: true,
      },
    }))

    const wrapper = renderWithWrappers(mockAdditionalDetailsForm)
    expect(wrapper.root.findByType(Checkbox).props.checked).toBe(true)
    wrapper.root.findByType(Checkbox).props.onPress()
    expect(wrapper.root.findByType(Checkbox).props.checked).toBe(false)
  })

  it("renders correct fields", () => {
    const wrapper = renderWithWrappers(mockAdditionalDetailsForm)

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
