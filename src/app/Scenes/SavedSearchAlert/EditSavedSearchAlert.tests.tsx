import { fireEvent, waitFor } from "@testing-library/react-native"
import { goBack } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractText } from "app/tests/extractText"
import { mockFetchNotificationPermissions } from "app/tests/mockFetchNotificationPermissions"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { PushAuthorizationStatus } from "app/utils/PushNotification"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { EditSavedSearchAlertQueryRenderer } from "./EditSavedSearchAlert"

jest.unmock("react-relay")

describe("EditSavedSearchAlert", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
  const notificationPermissions = mockFetchNotificationPermissions(false)

  beforeEach(() => {
    mockEnvironment.mockClear()
    notificationPermissions.mockImplementationOnce((cb) =>
      cb(null, PushAuthorizationStatus.Authorized)
    )
  })

  const TestRenderer = () => {
    return <EditSavedSearchAlertQueryRenderer savedSearchAlertId="savedSearchAlertId" />
  }

  it("renders without throwing an error", () => {
    const { getAllByTestId, getByTestId } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      SearchCriteria: () => searchCriteria,
    })
    resolveMostRecentRelayOperation(mockEnvironment, {
      FilterArtworksConnection: () => filterArtworks,
      Viewer: () => viewerMocked,
    })

    expect(getAllByTestId("alert-pill").map(extractText)).toEqual(["name-1", "Lithograph", "Paper"])
    expect(getByTestId("alert-input-name").props.value).toBe("unique-name")
  })

  it("should navigate go back if the update mutation is successful", async () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      SearchCriteria: () => searchCriteria,
    })
    resolveMostRecentRelayOperation(mockEnvironment, {
      FilterArtworksConnection: () => filterArtworks,
      Viewer: () => viewerMocked,
    })

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      resolveMostRecentRelayOperation(mockEnvironment, {
        SearchCriteria: () => ({
          userAlertSettings: {
            name: "updated-name",
          },
        }),
      })
    })

    expect(goBack).toHaveBeenCalled()
  })

  it("should pass updated criteria to update mutation when pills are removed", async () => {
    const { getByText, getAllByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      SearchCriteria: () => searchCriteria,
      Viewer: () => viewerMocked,
    })
    resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({
        internalID: "artistID",
        slug: "artistSlug",
      }),
      FilterArtworksConnection: () => filterArtworks,
    })

    fireEvent.press(getByText("Lithograph"))
    fireEvent.press(getAllByText("Save Alert")[0])

    await waitFor(() => {
      const operation = mockEnvironment.mock.getMostRecentOperation()
      expect(operation.fragment.node.name).toBe("getSavedSearchIdByCriteriaQuery")
    })

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => ({
        savedSearch: null,
      }),
    })

    await waitFor(() => {
      const operation = mockEnvironment.mock.getMostRecentOperation()
      expect(operation.request.variables.input).toEqual({
        searchCriteriaID: "savedSearchAlertId",
        attributes: {
          artistIDs: ["artistID"],
          materialsTerms: ["paper"],
        },
        userAlertSettings: {
          name: "unique-name",
          push: true,
          email: true,
        },
      })
    })
  })

  it("should display artist name as placeholder for input name", async () => {
    const { getByPlaceholderText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      SearchCriteria: () => ({
        ...searchCriteria,
        userAlertSettings: {
          ...searchCriteria.userAlertSettings,
          name: "",
        },
      }),
    })
    resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({
        internalID: "artistID",
        name: "Artist Name",
        slug: "artistSlug",
      }),
      FilterArtworksConnection: () => filterArtworks,
      Viewer: () => viewerMocked,
    })

    expect(getByPlaceholderText("Artist Name")).toBeTruthy()
  })

  describe("Notificaton toggles", () => {
    it("email and push toggles are enabled", async () => {
      const { getAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        SearchCriteria: () => searchCriteria,
      })
      resolveMostRecentRelayOperation(mockEnvironment, {
        FilterArtworksConnection: () => filterArtworks,
        Viewer: () => ({
          notificationPreferences: [
            {
              channel: "email",
              name: "custom_alerts",
              status: "SUBSCRIBED",
            },
          ],
        }),
      })

      expect(getAllByA11yState({ selected: true })).toHaveLength(2)
    })

    it("email and push toggles are disabled", async () => {
      const { getAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        SearchCriteria: () => ({
          ...searchCriteria,
          userAlertSettings: {
            ...searchCriteria.userAlertSettings,
            email: false,
            push: false,
          },
        }),
      })
      resolveMostRecentRelayOperation(mockEnvironment, {
        FilterArtworksConnection: () => filterArtworks,
        Viewer: () => viewerMocked,
      })

      expect(getAllByA11yState({ selected: false })).toHaveLength(2)
    })

    it("push toggle is enabled, email toggle is disabled", async () => {
      const { getAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        SearchCriteria: () => ({
          ...searchCriteria,
          userAlertSettings: {
            ...searchCriteria.userAlertSettings,
            push: false,
          },
        }),
      })
      resolveMostRecentRelayOperation(mockEnvironment, {
        FilterArtworksConnection: () => filterArtworks,
        Viewer: () => viewerMocked,
      })

      expect(getAllByA11yState({ selected: false })).toHaveLength(1)
    })

    it("email toggle is enabled, push toggle is disabled", async () => {
      const { getAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        SearchCriteria: () => ({
          ...searchCriteria,
          userAlertSettings: {
            ...searchCriteria.userAlertSettings,
            email: false,
          },
        }),
      })
      resolveMostRecentRelayOperation(mockEnvironment, {
        FilterArtworksConnection: () => filterArtworks,
        Viewer: () => ({
          notificationPreferences: [
            {
              channel: "email",
              name: "custom_alerts",
              status: "SUBSCRIBED",
            },
          ],
        }),
      })

      expect(getAllByA11yState({ selected: false })).toHaveLength(1)
    })
  })
})

const searchCriteria = {
  acquireable: null,
  additionalGeneIDs: [],
  artistIDs: ["artistID"],
  atAuction: null,
  attributionClass: [],
  colors: [],
  dimensionRange: null,
  sizes: [],
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
    push: true,
    email: true,
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

const viewerMocked = {
  notificationPreferences: [],
}
