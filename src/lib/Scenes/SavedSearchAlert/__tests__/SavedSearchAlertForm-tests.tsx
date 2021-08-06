import { fireEvent } from "@testing-library/react-native"
import { useFormikContext } from "formik"
import { Aggregations, FilterArray, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
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

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders without throwing an error", () => {
    renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)
  })

  it("correctly renders placeholder for input name", () => {
    const { getByTestId } = renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)

    expect(getByTestId("alert-input-name").props.placeholder).toEqual("artistName • 5 filters")
  })

  it("correctly extracts the values of pills", () => {
    const { getAllByTestId } = renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)

    expect(getAllByTestId("alert-pill").map(extractText)).toEqual([
      "Limited Edition",
      "Tate Ward Auctions",
      "New York, NY, USA",
      "Photography",
      "Prints",
    ])
  })

  it(`should render "Delete Alert" button when the onDeletePress prop is passed`, () => {
    const { getByTestId } = renderWithWrappersTL(<SavedSearchAlertForm onDeletePress={jest.fn} {...baseProps} />)
    const button = getByTestId("delete-alert-button")

    expect(extractText(button)).toContain("Delete Alert")
  })

  it("fires onDeletePress prop when the delete alert button is pressed", () => {
    const onDeletePressMock = jest.fn()
    const { getByTestId } = renderWithWrappersTL(
      <SavedSearchAlertForm {...baseProps} onDeletePress={onDeletePressMock} />
    )

    fireEvent.press(getByTestId("delete-alert-button"))

    expect(onDeletePressMock).toHaveBeenCalled()
  })

  it("fires formik's handleSubmit when the save alert button is pressed", () => {
    const handleSubmitMock = jest.fn()
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      handleSubmit: handleSubmitMock,
      isSubmitting: false,
      values: {
        name: "",
      },
      errors: {},
    }))
    const { getByTestId } = renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)

    fireEvent.press(getByTestId("save-alert-button"))

    expect(handleSubmitMock).toHaveBeenCalled()
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
  mutation: jest.fn(),
  initialValues: {
    name: "",
  },
  filters,
  aggregations,
  artist: {
    id: "artistId",
    name: "artistName",
  },
}
