import { fireEvent, waitFor } from "@testing-library/react-native"
import { EditSavedSearchAlertTestsQuery } from "__generated__/EditSavedSearchAlertTestsQuery.graphql"
import { goBack } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { EditSavedSearchAlertFragmentContainer as EditSavedSearchAlert } from "../EditSavedSearchAlert"

jest.unmock("react-relay")

describe("EditSavedSearchAlert", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment.mockClear()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<EditSavedSearchAlertTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query EditSavedSearchAlertTestsQuery($savedSearchAlertId: ID!, $artistID: String!) @relay_test_operation {
            me {
              ...EditSavedSearchAlert_me @arguments(savedSearchAlertId: $savedSearchAlertId)
            }
            artist(id: $artistID) {
              ...EditSavedSearchAlert_artist
            }
          }
        `}
        render={({ props }) => {
          if (props?.artist && props.me) {
            return <EditSavedSearchAlert savedSearchAlertId="savedSearchAlertId" artist={props.artist} me={props.me} />
          }

          return null
        }}
        variables={{
          savedSearchAlertId: "savedSearchAlertId",
          artistID: "artistID",
        }}
      />
    )
  }

  it("renders without throwing an error", () => {
    const { getAllByTestId, getByTestId } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      SearchCriteria: () => searchCriteria,
      FilterArtworksConnection: () => filterArtworks,
    })

    expect(getAllByTestId("alert-pill").map(extractText)).toEqual(["Lithograph", "Paper"])
    expect(getByTestId("alert-input-name").props.value).toBe("unique-name")
  })

  it("calls update mutation when form is submitted", async () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      SearchCriteria: () => searchCriteria,
      FilterArtworksConnection: () => filterArtworks,
    })

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

  it("should navigate go back if the update mutation is successful", async () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      SearchCriteria: () => searchCriteria,
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
