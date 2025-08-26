import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { EditSavedSearchAlertQueryRenderer } from "app/Scenes/SavedSearchAlert/EditSavedSearchAlert"
import { useSavedSearchPills } from "app/Scenes/SavedSearchAlert/useSavedSearchPills"
import { goBack } from "app/system/navigation/navigate"
import { PushAuthorizationStatus } from "app/system/notifications/getNotificationsPermissions"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractText } from "app/utils/tests/extractText"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockFetchNotificationPermissions } from "app/utils/tests/mockFetchNotificationPermissions"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/Scenes/SavedSearchAlert/useSavedSearchPills")

describe("EditSavedSearchAlert", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const notificationPermissions = mockFetchNotificationPermissions as jest.Mock

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
    notificationPermissions().mockImplementationOnce(() =>
      Promise.resolve(PushAuthorizationStatus.Authorized)
    )
    ;(useSavedSearchPills as jest.Mock).mockImplementation(() => pills)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestRenderer = () => {
    return <EditSavedSearchAlertQueryRenderer savedSearchAlertId="savedSearchAlertId" />
  }

  it("renders without throwing an error", async () => {
    renderWithWrappers(<TestRenderer />)

    // await waitFor(() => {
    resolveMostRecentRelayOperation(mockEnvironment, {
      Alert: () => alert,
    })

    resolveMostRecentRelayOperation(mockEnvironment, {
      Viewer: () => viewerMocked,
    })

    resolveMostRecentRelayOperation(mockEnvironment)

    expect(screen.getAllByTestId("alert-pill").map(extractText)).toEqual([
      "Banksy",
      "Monkeys",
      "Lithograph",
      "Paper",
    ])
  })

  // TODO: fix this test
  it.skip("should pass updated criteria to update mutation when pills are removed", async () => {
    ;(useSavedSearchPills as jest.Mock)
      .mockImplementationOnce(() => pills)
      .mockImplementationOnce(() => pills)
      .mockImplementationOnce(() => pills)
      .mockImplementation(() => pills.filter((pill) => pill.label !== "Lithograph"))

    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Alert: () => alert,
      Viewer: () => viewerMocked,
    })
    resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({
        internalID: "artistID",
        slug: "artistSlug",
      }),
    })

    await flushPromiseQueue()

    fireEvent.press(screen.getByText("Lithograph"))
    fireEvent.press(screen.getAllByText("Save Alert")[0])

    await waitFor(() => {
      const operation = mockEnvironment.mock.getMostRecentOperation()
      expect(operation.fragment.node.name).toBe("getAlertByCriteriaQuery")
    })

    resolveMostRecentRelayOperation(mockEnvironment, {
      Alert: () => ({
        internalID: null,
      }),
    })

    await waitFor(() => {
      const operation = mockEnvironment.mock.getMostRecentOperation()
      expect(operation.request.variables.input).toEqual({
        id: "savedSearchAlertId",
        artistIDs: ["artistID"],
        artistSeriesIDs: ["monkeys"],
        materialsTerms: ["paper"],
        settings: {
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
        Alert: () => ({
          ...alert,
          name: "",
          settings: {
            ...alert.settings,
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
        Viewer: () => viewerMocked,
      })
    })
  })

  describe("Notificaton toggles", () => {
    it("email and push toggles are enabled", async () => {
      renderWithWrappers(<TestRenderer />)

      await waitFor(() => {
        resolveMostRecentRelayOperation(mockEnvironment, {
          Alert: () => alert,
        })
        resolveMostRecentRelayOperation(mockEnvironment, {
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
      })

      expect(screen.getByLabelText("Email Toggler")).toBeOnTheScreen()
      expect(screen.getByLabelText("Email Toggler")).toBeSelected()
      expect(screen.getByLabelText("Push Notifications Toggler")).toBeOnTheScreen()
      expect(screen.getByLabelText("Push Notifications Toggler")).toBeSelected()
    })

    it("email and push toggles are disabled", async () => {
      renderWithWrappers(<TestRenderer />)

      await waitFor(() => {
        resolveMostRecentRelayOperation(mockEnvironment, {
          Alert: () => ({
            ...alert,
            settings: {
              ...alert.settings,
              email: false,
              push: false,
            },
          }),
        })
        resolveMostRecentRelayOperation(mockEnvironment, {
          Viewer: () => viewerMocked,
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
          Alert: () => ({
            ...alert,
            settings: {
              ...alert.settings,
              push: false,
            },
          }),
        })
        resolveMostRecentRelayOperation(mockEnvironment, {
          Viewer: () => viewerMocked,
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
          Alert: () => ({
            ...alert,
            settings: {
              ...alert.settings,
              email: false,
            },
          }),
        })
        resolveMostRecentRelayOperation(mockEnvironment, {
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

    describe("Save Button", () => {
      it("is disabled when the screen mounts", async () => {
        renderWithWrappers(<TestRenderer />)

        await waitFor(() => {
          resolveMostRecentRelayOperation(mockEnvironment, {
            Alert: () => alert,
          })
          resolveMostRecentRelayOperation(mockEnvironment, {
            Viewer: () => viewerMocked,
          })

          resolveMostRecentRelayOperation(mockEnvironment)
        })

        const saveButton = screen.getByText("Save Alert")
        fireEvent.press(saveButton, "onPress")

        expect(() => mockEnvironment.mock.getMostRecentOperation()).toThrowError()
      })

      it("is enabled when the user taps on a suggested filter", async () => {
        renderWithWrappers(<TestRenderer />)

        resolveMostRecentRelayOperation(mockEnvironment, {
          Alert: () => alert,
        })
        resolveMostRecentRelayOperation(mockEnvironment, {
          Viewer: () => viewerMocked,
        })
        resolveMostRecentRelayOperation(mockEnvironment, {
          PreviewSavedSearch: () => ({
            suggestedFilters: mockSuggestedFilters,
          }),
        })

        await screen.findByText("Painting")

        fireEvent.press(screen.getByText("Painting"), "onPress")

        await flushPromiseQueue()

        const saveButton = screen.getByText("Save Alert")

        fireEvent.press(saveButton, "onPress")

        await flushPromiseQueue()

        expect(mockEnvironment.mock.getMostRecentOperation().fragment.node.name).toBe(
          "getAlertByCriteriaQuery"
        )
        resolveMostRecentRelayOperation(mockEnvironment, {
          Alert: () => ({
            internalID: null,
          }),
        })

        await flushPromiseQueue()

        expect(mockEnvironment.mock.getMostRecentOperation().fragment.node.name).toBe(
          "updateSavedSearchAlertMutation"
        )
        resolveMostRecentRelayOperation(mockEnvironment, {
          Alert: () => alert,
        })

        await flushPromiseQueue()

        expect(goBack).toHaveBeenCalled()
      })
    })
  })
})

const alert = {
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
  settings: {
    name: null,
    push: true,
    email: true,
    details: null,
  },
}

const viewerMocked = {
  notificationPreferences: [],
}

const mockSuggestedFilters = [
  {
    displayValue: "Painting",
    field: "additionalGeneIDs",
    name: "Medium",
    value: "painting",
  },
]

const pills = [
  { label: "Banksy", paramName: "artistIDs", value: "banksy" },
  { label: "Monkeys", paramName: "artistSeriesIDs", value: "monkeys" },
  { label: "Lithograph", paramName: "materialTerms", value: "lithograph" },
  { label: "Paper", paramName: "materialTerms", value: "paper" },
]
