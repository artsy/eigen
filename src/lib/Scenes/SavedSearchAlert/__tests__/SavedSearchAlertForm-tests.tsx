import { useFormikContext } from "formik"
import { Aggregations, FilterArray, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { Input } from "lib/Components/Input/Input"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Pill } from "palette"
import React from "react"
import { SavedSearchAlertForm } from "../SavedSearchAlertForm"

jest.mock("formik")

describe("Saved search alert form", () => {
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      handleSubmit: jest.fn(),
      isSubmitting: false,
      values: {
        name: "",
      },
      errors: {},
    }))
  })

  it("renders without throwing an error", () => {
    renderWithWrappers(<SavedSearchAlertForm {...baseProps} />)
  })

  it("correctly renders placeholder for input name", () => {
    const wrapper = renderWithWrappers(<SavedSearchAlertForm {...baseProps} />)

    expect(wrapper.root.findByType(Input).props.placeholder).toEqual("artistName • 4 filters")
  })

  it("correctly extracts the values of pills", () => {
    const wrapper = renderWithWrappers(<SavedSearchAlertForm {...baseProps} />)
    const pills = wrapper.root.findAllByType(Pill)

    expect(pills.map(extractText)).toEqual([
      "Limited Edition",
      "Tate Ward Auctions",
      "New York, NY, USA",
      "Photography",
      "Prints",
    ])
  })
})

const filters: FilterArray = [
  {
    paramName: FilterParamName.attributionClass,
    displayText: "Limited Edition",
    paramValue: ["limited edition"],
  },
  {
    paramName: FilterParamName.partnerIDs,
    displayText: "Tate Ward Auctions",
    paramValue: ["tate-ward-auctions"],
  },
  {
    paramName: FilterParamName.locationCities,
    displayText: "New York, NY, USA",
    paramValue: ["New York, NY, USA"],
  },
  {
    paramName: FilterParamName.additionalGeneIDs,
    displayText: "Photography, Prints",
    paramValue: ["photography", "prints"],
  },
]

const aggregations: Aggregations = [
  {
    slice: "MEDIUM",
    counts: [
      {
        count: 18037,
        name: "Photography",
        value: "photography",
      },
      {
        count: 2420,
        name: "Prints",
        value: "prints",
      },
      {
        count: 513,
        name: "Ephemera or Merchandise",
        value: "ephemera-or-merchandise",
      },
    ],
  },
  {
    slice: "LOCATION_CITY",
    counts: [
      {
        count: 18242,
        name: "New York, NY, USA",
        value: "New York, NY, USA",
      },
      {
        count: 322,
        name: "London, United Kingdom",
        value: "London, United Kingdom",
      },
    ],
  },
  {
    slice: "PARTNER",
    counts: [
      {
        count: 18210,
        name: "Cypress Test Partner [For Automated Testing Purposes]",
        value: "cypress-test-partner-for-automated-testing-purposes",
      },
      {
        count: 578,
        name: "Tate Ward Auctions",
        value: "tate-ward-auctions",
      },
    ],
  },
]

const baseProps = {
  filters,
  aggregations,
  artist: {
    id: "artistId",
    name: "artistName",
  },
}
