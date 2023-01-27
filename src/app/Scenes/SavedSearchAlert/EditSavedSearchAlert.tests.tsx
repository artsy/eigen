import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { goBack } from "app/system/navigation/navigate"
import { PushAuthorizationStatus } from "app/utils/PushNotification"
import { extractText } from "app/utils/tests/extractText"
import { mockFetchNotificationPermissions } from "app/utils/tests/mockFetchNotificationPermissions"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { EditSavedSearchAlertQueryRenderer } from "./EditSavedSearchAlert"

describe("EditSavedSearchAlert", () => {
  const notificationPermissions = mockFetchNotificationPermissions(false)

  beforeEach(() => {
    notificationPermissions.mockImplementationOnce((cb) =>
      cb(null, PushAuthorizationStatus.Authorized)
    )
  })

  const { renderWithRelay } = setupTestWrapper({
    Component: () => <EditSavedSearchAlertQueryRenderer savedSearchAlertId="savedSearchAlertId" />,
  })

  const TestRenderer = () => {
    return <EditSavedSearchAlertQueryRenderer savedSearchAlertId="savedSearchAlertId" />
  }

  it("renders without throwing an error", () => {
    const { getAllByTestId, getByTestId, env } = renderWithRelay()

    resolveMostRecentRelayOperation(env, {
      SearchCriteria: () => searchCriteria,
    })
    resolveMostRecentRelayOperation(env, {
      FilterArtworksConnection: () => filterArtworks,
      Viewer: () => viewerMocked,
    })

    expect(getAllByTestId("alert-pill").map(extractText)).toEqual(["name-1", "Lithograph", "Paper"])
    expect(getByTestId("alert-input-name").props.value).toBe("unique-name")
  })

  it("should navigate go back if the update mutation is successful", async () => {
    const { getByTestId, env } = renderWithRelay()

    resolveMostRecentRelayOperation(env, {
      SearchCriteria: () => searchCriteria,
    })
    resolveMostRecentRelayOperation(env, {
      FilterArtworksConnection: () => filterArtworks,
      Viewer: () => viewerMocked,
    })

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      resolveMostRecentRelayOperation(env, {
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
    const { getByText, getAllByText, env } = renderWithRelay()

    resolveMostRecentRelayOperation(env, {
      SearchCriteria: () => searchCriteria,
      Viewer: () => viewerMocked,
    })
    resolveMostRecentRelayOperation(env, {
      Artist: () => ({
        internalID: "artistID",
        slug: "artistSlug",
      }),
      FilterArtworksConnection: () => filterArtworks,
    })

    fireEvent.press(getByText("Lithograph"))
    fireEvent.press(getAllByText("Save Alert")[0])

    await waitFor(() => {
      const operation = env.mock.getMostRecentOperation()
      expect(operation.fragment.node.name).toBe("getSavedSearchIdByCriteriaQuery")
    })

    resolveMostRecentRelayOperation(env, {
      Me: () => ({
        savedSearch: null,
      }),
    })

    await waitFor(() => {
      const operation = env.mock.getMostRecentOperation()
      expect(operation.request.variables.input).toEqual({
        searchCriteriaID: "savedSearchAlertId",
        attributes: {
          artistIDs: ["artistID"],
          internalID: "internalID-1",
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
    const { getByPlaceholderText, env } = renderWithRelay()

    resolveMostRecentRelayOperation(env, {
      SearchCriteria: () => ({
        ...searchCriteria,
        userAlertSettings: {
          ...searchCriteria.userAlertSettings,
          name: "",
        },
      }),
    })
    resolveMostRecentRelayOperation(env, {
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
      const { env } = renderWithRelay()

      resolveMostRecentRelayOperation(env, {
        SearchCriteria: () => searchCriteria,
      })
      resolveMostRecentRelayOperation(env, {
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

      expect(screen.queryAllByA11yState({ selected: true })).toHaveLength(2)
    })

    it("email and push toggles are disabled", async () => {
      const { env } = renderWithRelay()

      resolveMostRecentRelayOperation(env, {
        SearchCriteria: () => ({
          ...searchCriteria,
          userAlertSettings: {
            ...searchCriteria.userAlertSettings,
            email: false,
            push: false,
          },
        }),
      })
      resolveMostRecentRelayOperation(env, {
        FilterArtworksConnection: () => filterArtworks,
        Viewer: () => viewerMocked,
      })

      expect(screen.queryByLabelText("Email Alerts Toggler")).toHaveProp("accessibilityState", {
        selected: false,
      })
      expect(screen.queryByLabelText("Mobile Alerts Toggler")).toHaveProp("accessibilityState", {
        selected: false,
      })
    })

    it("email toggle is enabled, push toggle is disabled", async () => {
      const { env } = renderWithRelay()

      resolveMostRecentRelayOperation(env, {
        SearchCriteria: () => ({
          ...searchCriteria,
          userAlertSettings: {
            ...searchCriteria.userAlertSettings,
            push: false,
          },
        }),
      })
      resolveMostRecentRelayOperation(env, {
        FilterArtworksConnection: () => filterArtworks,
        Viewer: () => viewerMocked,
      })

      expect(screen.queryByLabelText("Email Alerts Toggler")).toHaveProp("accessibilityState", {
        selected: true,
      })
      expect(screen.queryByLabelText("Mobile Alerts Toggler")).toHaveProp("accessibilityState", {
        selected: false,
      })
    })

    it("push toggle is enabled, email toggle is disabled", async () => {
      const { env } = renderWithRelay()

      resolveMostRecentRelayOperation(env, {
        SearchCriteria: () => ({
          ...searchCriteria,
          userAlertSettings: {
            ...searchCriteria.userAlertSettings,
            email: false,
          },
        }),
      })
      resolveMostRecentRelayOperation(env, {
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

      expect(screen.queryByLabelText("Email Alerts Toggler")).toHaveProp("accessibilityState", {
        selected: false,
      })
      expect(screen.queryByLabelText("Mobile Alerts Toggler")).toHaveProp("accessibilityState", {
        selected: true,
      })
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
