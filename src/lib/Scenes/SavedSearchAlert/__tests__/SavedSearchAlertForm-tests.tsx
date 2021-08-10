import { fireEvent, waitFor } from "@testing-library/react-native"
import { Aggregations, FilterData, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { Alert } from "react-native"
import { createMockEnvironment } from "relay-test-utils"
import { SavedSearchAlertForm, SavedSearchAlertFormProps } from "../SavedSearchAlertForm"

const spyAlert = jest.spyOn(Alert, "alert")

describe("Saved search alert form", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment.mockClear()
    ;(Alert.alert as jest.Mock).mockClear()
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

  it(`should render "Delete Alert" button when the savedSearchAlertId is passed`, () => {
    const { getAllByTestId } = renderWithWrappersTL(
      <SavedSearchAlertForm {...baseProps} savedSearchAlertId="savedSearchAlertId" />
    )

    expect(getAllByTestId("delete-alert-button")).toHaveLength(1)
  })

  it("calls update mutation when form is submitted", async () => {
    const { getByTestId } = renderWithWrappersTL(
      <SavedSearchAlertForm {...baseProps} savedSearchAlertId="savedSearchAlertId" />
    )

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      const mutation = mockEnvironment.mock.getMostRecentOperation()

      expect(mutation.request.node.operation.name).toBe("updateSavedSearchAlertMutation")
      expect(mutation.request.variables).toEqual({
        input: {
          searchCriteriaID: "savedSearchAlertId",
          userAlertSettings: {
            name: "something new",
          },
        },
      })
    })
  })

  it("calls create mutation when form is submitted", async () => {
    const { getByTestId } = renderWithWrappersTL(<SavedSearchAlertForm {...baseProps} />)

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      const mutation = mockEnvironment.mock.getMostRecentOperation()

      expect(mutation.request.node.operation.name).toBe("createSavedSearchAlertMutation")
      expect(mutation.request.variables).toEqual({
        input: {
          attributes: {
            artistID: "artistID",
            attributionClass: ["limited edition"],
            partnerIDs: ["tate-ward-auctions"],
            locationCities: ["New York, NY, USA"],
            additionalGeneIDs: ["photography", "prints"],
          },
          userAlertSettings: {
            name: "something new",
          },
        },
      })
    })
  })

  it("calls onComplete when the mutation is completed", async () => {
    const onCompleteMock = jest.fn()
    const { getByTestId } = renderWithWrappersTL(
      <SavedSearchAlertForm {...baseProps} onComplete={onCompleteMock} savedSearchAlertId="savedSearchAlertId" />
    )

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      mockEnvironmentPayload(mockEnvironment)
    })

    expect(onCompleteMock).toHaveBeenCalled()
  })

  it("calls delete mutation when the delete alert button is pressed", async () => {
    const onDeletePressMock = jest.fn()
    const { getByTestId } = renderWithWrappersTL(
      <SavedSearchAlertForm
        {...baseProps}
        savedSearchAlertId="savedSearchAlertId"
        onDeleteComplete={onDeletePressMock}
      />
    )

    fireEvent.press(getByTestId("delete-alert-button"))

    /**
     * Click confirm button in Alert
     *
     * The first call of the function
     * calls[0] === [
     *  [
     *    'Title', === calls[0][0]
     *    'Description' === calls[0][1],
     *    [
     *      ['cancel button'], === calls[0][2][0]
     *      ['confirm button'] === calls[0][2][1]
     *    ]
     *  ]
     * ]
     */

    // @ts-ignore
    spyAlert.mock.calls[0][2][1].onPress()

    expect(mockEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "deleteSavedSearchAlertMutation"
    )

    await waitFor(() => {
      mockEnvironmentPayload(mockEnvironment)
    })

    expect(onDeletePressMock).toHaveBeenCalled()
  })
})

const filters: FilterData[] = [
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

const baseProps: SavedSearchAlertFormProps = {
  initialValues: {
    name: "",
  },
  filters,
  aggregations,
  artist: {
    id: "artistID",
    name: "artistName",
  },
}
