import { fireEvent, waitFor } from "@testing-library/react-native"
import { goBack } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { EditSavedSearchAlertQueryRenderer } from "../EditSavedSearchAlert"

jest.unmock("react-relay")

describe("EditSavedSearchAlert", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment.mockClear()
  })

  const TestRenderer = () => {
    return <EditSavedSearchAlertQueryRenderer savedSearchAlertId="savedSearchAlertId" />
  }

  it("renders without throwing an error", () => {
    const { getAllByTestId, getByTestId } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      SearchCriteria: () => searchCriteria,
    })
    mockEnvironmentPayload(mockEnvironment, {
      FilterArtworksConnection: () => filterArtworks,
    })

    expect(getAllByTestId("alert-pill").map(extractText)).toEqual(["Lithograph", "Paper"])
    expect(getByTestId("alert-input-name").props.value).toBe("unique-name")
  })

<<<<<<< HEAD
  it("should navigate go back if the update mutation is successful", async () => {
=======
  it("calls update mutation when form is submitted", async () => {
>>>>>>> chore: small refactor
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      SearchCriteria: () => searchCriteria,
    })
<<<<<<< HEAD
=======

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      const mutation = mockEnvironment.mock.getMostRecentOperation()

      expect(mutation.request.node.operation.name).toBe("EditSavedSearchAlertUpdateSavedSearchMutation")
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

  it("should navigate go back if the update mutation is successful", async () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

>>>>>>> chore: small refactor
    mockEnvironmentPayload(mockEnvironment, {
      FilterArtworksConnection: () => filterArtworks,
    })

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      mockEnvironmentPayload(mockEnvironment, {
        SearchCriteria: () => ({
          userAlertSettings: {
            name: "updated-name",
          },
        }),
      })
    })

    expect(goBack).toHaveBeenCalled()
  })
})

const searchCriteria = {
  acquireable: null,
  additionalGeneIDs: [],
  artistID: "artistID",
  atAuction: null,
  attributionClass: [],
  colors: [],
  dimensionRange: null,
  height: null,
  inquireableOnly: null,
  locationCities: [],
  majorPeriods: [],
  materialsTerms: ["lithograph", "paper"],
  offerable: null,
  partnerIDs: [],
  priceRange: null,
  width: null,
  userAlertSettings: {
    name: "unique-name",
  },
}

const filterArtworks = {
  aggregations: [
    {
      slice: "MATERIALS_TERMS",
      counts: [
        {
          count: 641,
          name: "Lithograph",
          value: "lithograph",
        },
        {
          count: 411,
          name: "Paper",
          value: "paper",
        },
      ],
    },
  ],
}
