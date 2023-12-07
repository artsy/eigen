import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { goBack } from "app/system/navigation/navigate"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { PushAuthorizationStatus } from "app/utils/PushNotification"
import { extractText } from "app/utils/tests/extractText"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockFetchNotificationPermissions } from "app/utils/tests/mockFetchNotificationPermissions"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"
import { EditSavedSearchAlertQueryRenderer } from "./EditSavedSearchAlert"

describe("EditSavedSearchAlert", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const notificationPermissions = mockFetchNotificationPermissions(false)

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
    notificationPermissions.mockImplementationOnce((cb) =>
      cb(null, PushAuthorizationStatus.Authorized)
    )
  })

  const TestRenderer = () => {
    return <EditSavedSearchAlertQueryRenderer savedSearchAlertId="savedSearchAlertId" />
  }

  it("renders without throwing an error", async () => {
    renderWithWrappers(<TestRenderer />)

    await waitFor(() => {
      resolveMostRecentRelayOperation(mockEnvironment, {
        SearchCriteria: () => searchCriteria,
      })

      resolveMostRecentRelayOperation(mockEnvironment, {
        FilterArtworksConnection: () => filterArtworks,
        Viewer: () => viewerMocked,
      })

      resolveMostRecentRelayOperation(mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        PreviewSavedSearch: () => ({ displayName: "Banana" }),
      })
    })

    expect(screen.getAllByTestId("alert-pill").map(extractText)).toEqual([
      "name-1",
      "Lithograph",
      "Paper",
    ])
    expect(screen.getByTestId("alert-input-name").props.value).toBe("")
    expect(screen.getByTestId("alert-input-name").props.placeholder).toBe("Banana")
  })

  it("should navigate go back if the update mutation is successful", async () => {
    renderWithWrappers(<TestRenderer />)

    await waitFor(() => {
      resolveMostRecentRelayOperation(mockEnvironment, {
        SearchCriteria: () => searchCriteria,
      })
      resolveMostRecentRelayOperation(mockEnvironment, {
        FilterArtworksConnection: () => filterArtworks,
        Viewer: () => viewerMocked,
      })

      resolveMostRecentRelayOperation(mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        PreviewSavedSearch: () => ({ displayName: "Banana" }),
      })
    })

    fireEvent.changeText(screen.getByTestId("alert-input-name"), "something new")
    fireEvent.press(screen.getByTestId("save-alert-button"))

    await waitFor(() => {
      resolveMostRecentRelayOperation(mockEnvironment, {
        PreviewSavedSearch: () => ({ displayName: "Banana" }),
      })
    })

    expect(goBack).toHaveBeenCalled()
  })

  it("should pass updated criteria to update mutation when pills are removed", async () => {
    renderWithWrappers(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockEnvironment, {
      PreviewSavedSearch: () => ({ displayName: "Banana" }),
    })

    await flushPromiseQueue()

    fireEvent.press(screen.getByText("Lithograph"))
    fireEvent.press(screen.getAllByText("Save Alert")[0])

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
          artistSeriesIDs: ["monkeys"],
          materialsTerms: ["paper"],
        },
        userAlertSettings: {
          push: true,
          email: true,
          name: "",
          details: "",
        },
      })
    })
  })

  it("should display saved search preview display name as placeholder for input name", async () => {
    renderWithWrappers(<TestRenderer />)

    await waitFor(() => {
      resolveMostRecentRelayOperation(mockEnvironment, {
        SearchCriteria: () => ({
          ...searchCriteria,
          name: "",
          userAlertSettings: {
            ...searchCriteria.userAlertSettings,
          },
        }),
      })

      resolveMostRecentRelayOperation(mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artist: () => ({
          internalID: "artistID",
          name: "Artist Name",
          slug: "artistSlug",
        }),
        FilterArtworksConnection: () => filterArtworks,
        Viewer: () => viewerMocked,
      })

      resolveMostRecentRelayOperation(mockEnvironment, {
        PreviewSavedSearch: () => ({ displayName: "Banana" }),
      })
    })

    expect(screen.getByPlaceholderText("Banana")).toBeTruthy()
  })

  describe("Notificaton toggles", () => {
    it("email and push toggles are enabled", async () => {
      renderWithWrappers(<TestRenderer />)

      await waitFor(() => {
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
        resolveMostRecentRelayOperation(mockEnvironment, {
          PreviewSavedSearch: () => ({ displayName: "Banana" }),
        })
      })

      expect(screen.queryAllByA11yState({ selected: true })).toHaveLength(2)
    })

    it("email and push toggles are disabled", async () => {
      renderWithWrappers(<TestRenderer />)

      await waitFor(() => {
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
        resolveMostRecentRelayOperation(mockEnvironment, {
          PreviewSavedSearch: () => ({ displayName: "Banana" }),
        })
      })

      expect(screen.queryByLabelText("Email Toggler")).toHaveProp("accessibilityState", {
        selected: false,
      })
      expect(screen.queryByLabelText("Push Notifications Toggler")).toHaveProp(
        "accessibilityState",
        {
          selected: false,
        }
      )
    })

    it("email toggle is enabled, push toggle is disabled", async () => {
      renderWithWrappers(<TestRenderer />)

      await waitFor(() => {
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
        resolveMostRecentRelayOperation(mockEnvironment, {
          PreviewSavedSearch: () => ({ displayName: "Banana" }),
        })
      })

      expect(screen.queryByLabelText("Email Toggler")).toHaveProp("accessibilityState", {
        selected: true,
      })
      expect(screen.queryByLabelText("Push Notifications Toggler")).toHaveProp(
        "accessibilityState",
        {
          selected: false,
        }
      )
    })

    it("push toggle is enabled, email toggle is disabled", async () => {
      renderWithWrappers(<TestRenderer />)

      await waitFor(() => {
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
        resolveMostRecentRelayOperation(mockEnvironment, {
          PreviewSavedSearch: () => ({ displayName: "Banana" }),
        })
      })

      expect(screen.queryByLabelText("Email Toggler")).toHaveProp("accessibilityState", {
        selected: false,
      })
      expect(screen.queryByLabelText("Push Notifications Toggler")).toHaveProp(
        "accessibilityState",
        {
          selected: true,
        }
      )
    })
  })
})

const searchCriteria = {
  acquireable: null,
  additionalGeneIDs: [],
  artistIDs: ["artistID"],
  artistSeriesIDs: ["monkeys"],
  atAuction: null,
  attributionClass: [],
  colors: [],
  dimensionRange: null,
  name: "unique-name",
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
    name: null,
    push: true,
    email: true,
    details: null,
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
