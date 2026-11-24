import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { EditSavedSearchAlertQueryRenderer } from "app/Scenes/SavedSearchAlert/EditSavedSearchAlert"
import { useSavedSearchPills } from "app/Scenes/SavedSearchAlert/useSavedSearchPills"
import { goBack } from "app/system/navigation/navigate"
import { PushAuthorizationStatus } from "app/system/notifications/getNotificationsPermissions"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
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

  const waitForPendingOperation = () =>
    waitFor(() => expect(mockEnvironment.mock.getAllOperations()).not.toHaveLength(0))

  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestRenderer = () => {
    return <EditSavedSearchAlertQueryRenderer savedSearchAlertId="savedSearchAlertId" />
  }

  it("renders without throwing an error", async () => {
    await renderWithWrappers(<TestRenderer />)

    // await waitFor(() => {
    await resolveMostRecentRelayOperation(mockEnvironment, {
      Alert: () => alert,
    })

    await resolveMostRecentRelayOperation(mockEnvironment, {
      Viewer: () => viewerMocked,
    })

    await resolveMostRecentRelayOperation(mockEnvironment)

    const alertPills = screen.getAllByTestId("alert-pill")
    expect(alertPills).toHaveLength(4)
    expect(alertPills[0]).toHaveTextContent("Banksy")
    expect(alertPills[1]).toHaveTextContent("Monkeys")
    expect(alertPills[2]).toHaveTextContent("Lithograph")
    expect(alertPills[3]).toHaveTextContent("Paper")
  })

  it("should pass updated criteria to update mutation when pills are removed", async () => {
    ;(useSavedSearchPills as jest.Mock)
      .mockImplementationOnce(() => pills)
      .mockImplementationOnce(() => pills)
      .mockImplementationOnce(() => pills)
      .mockImplementation(() => pills.filter((pill) => pill.label !== "Lithograph"))

    await renderWithWrappers(<TestRenderer />)

    await resolveMostRecentRelayOperation(mockEnvironment, {
      Alert: () => alert,
      Viewer: () => viewerMocked,
    })
    await resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({
        internalID: "artistID",
        slug: "artistSlug",
      }),
    })

    await flushPromiseQueue()

    await fireEvent.press(screen.getByText("Lithograph"))
    await fireEvent.press(screen.getAllByText("Save Alert")[0])

    await waitFor(() => {
      const operation = mockEnvironment.mock.getMostRecentOperation()
      expect(operation.fragment.node.name).toBe("getAlertByCriteriaQuery")
    })

    await resolveMostRecentRelayOperation(mockEnvironment, {
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
    await renderWithWrappers(<TestRenderer />)

    await waitForPendingOperation()
    await resolveMostRecentRelayOperation(mockEnvironment, {
      Alert: () => ({
        ...alert,
        name: "",
        settings: {
          ...alert.settings,
        },
      }),
    })

    await waitForPendingOperation()
    await resolveMostRecentRelayOperation(mockEnvironment)

    await waitForPendingOperation()
    await resolveMostRecentRelayOperation(mockEnvironment, {
      Artist: () => ({
        internalID: "artistID",
        name: "Artist Name",
        slug: "artistSlug",
      }),
      Viewer: () => viewerMocked,
    })
  })

  describe("Notificaton toggles", () => {
    it("email and push toggles are enabled", async () => {
      await renderWithWrappers(<TestRenderer />)

      await waitForPendingOperation()
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Alert: () => alert,
      })
      await waitForPendingOperation()
      await resolveMostRecentRelayOperation(mockEnvironment, {
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

      expect(screen.getByLabelText("Email Toggler")).toBeOnTheScreen()
      expect(screen.getByLabelText("Email Toggler")).toBeSelected()
      expect(screen.getByLabelText("Push Notifications Toggler")).toBeOnTheScreen()
      expect(screen.getByLabelText("Push Notifications Toggler")).toBeSelected()
    })

    it("email and push toggles are disabled", async () => {
      await renderWithWrappers(<TestRenderer />)

      await waitForPendingOperation()
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Alert: () => ({
          ...alert,
          settings: {
            ...alert.settings,
            email: false,
            push: false,
          },
        }),
      })
      await waitForPendingOperation()
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Viewer: () => viewerMocked,
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
      await renderWithWrappers(<TestRenderer />)

      await waitForPendingOperation()
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Alert: () => ({
          ...alert,
          settings: {
            ...alert.settings,
            push: false,
          },
        }),
      })
      await waitForPendingOperation()
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Viewer: () => viewerMocked,
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
      await renderWithWrappers(<TestRenderer />)

      await waitForPendingOperation()
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Alert: () => ({
          ...alert,
          settings: {
            ...alert.settings,
            email: false,
          },
        }),
      })
      await waitForPendingOperation()
      await resolveMostRecentRelayOperation(mockEnvironment, {
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
        await renderWithWrappers(<TestRenderer />)

        await waitForPendingOperation()
        await resolveMostRecentRelayOperation(mockEnvironment, {
          Alert: () => alert,
        })
        await waitForPendingOperation()
        await resolveMostRecentRelayOperation(mockEnvironment, {
          Viewer: () => viewerMocked,
        })

        await waitForPendingOperation()
        await resolveMostRecentRelayOperation(mockEnvironment)

        const saveButton = screen.getByText("Save Alert")
        await fireEvent.press(saveButton)

        expect(() => mockEnvironment.mock.getMostRecentOperation()).toThrowError()
      })

      it("is enabled when the user taps on a suggested filter", async () => {
        await renderWithWrappers(<TestRenderer />)

        await resolveMostRecentRelayOperation(mockEnvironment, {
          Alert: () => alert,
        })
        await resolveMostRecentRelayOperation(mockEnvironment, {
          Viewer: () => viewerMocked,
        })
        await resolveMostRecentRelayOperation(mockEnvironment, {
          PreviewSavedSearch: () => ({
            suggestedFilters: mockSuggestedFilters,
          }),
        })

        await screen.findByText("Painting")

        await fireEvent.press(screen.getByText("Painting"))

        await flushPromiseQueue()

        const saveButton = screen.getByText("Save Alert")

        await fireEvent.press(saveButton)

        await flushPromiseQueue()

        expect(mockEnvironment.mock.getMostRecentOperation().fragment.node.name).toBe(
          "getAlertByCriteriaQuery"
        )
        await resolveMostRecentRelayOperation(mockEnvironment, {
          Alert: () => ({
            internalID: null,
          }),
        })

        await flushPromiseQueue()

        expect(mockEnvironment.mock.getMostRecentOperation().fragment.node.name).toBe(
          "updateSavedSearchAlertMutation"
        )
        await resolveMostRecentRelayOperation(mockEnvironment, {
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
  { label: "Lithograph", paramName: "materialsTerms", value: "lithograph" },
  { label: "Paper", paramName: "materialsTerms", value: "paper" },
]
