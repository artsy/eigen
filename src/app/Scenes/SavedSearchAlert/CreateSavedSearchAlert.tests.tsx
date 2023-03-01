import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { FilterData, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { SavedSearchEntity } from "app/Components/ArtworkFilter/SavedSearch/types"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { PushAuthorizationStatus } from "app/utils/PushNotification"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockFetchNotificationPermissions } from "app/utils/tests/mockFetchNotificationPermissions"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { CreateSavedSearchAlert } from "./CreateSavedSearchAlert"
import { CreateSavedSearchAlertParams } from "./SavedSearchAlertModel"

const filters: FilterData[] = [
  {
    displayText: "Bid",
    paramName: FilterParamName.waysToBuyBid,
    paramValue: true,
  },
  {
    displayText: "Open Edition",
    paramName: FilterParamName.attributionClass,
    paramValue: ["open edition"],
  },
]

const initialData: ArtworkFiltersState = {
  selectedFilters: [],
  appliedFilters: filters,
  previouslyAppliedFilters: filters,
  applyFilters: false,
  aggregations: [],
  filterType: "artwork",
  counts: {
    total: null,
    followedArtists: null,
  },
  sizeMetric: "cm",
}

const savedSearchEntity: SavedSearchEntity = {
  placeholder: "Placeholder",
  artists: [],
  owner: {
    type: OwnerType.artist,
    id: "ownerId",
    slug: "ownerSlug",
  },
}

const defaultParams: CreateSavedSearchAlertParams = {
  aggregations: [],
  attributes: {
    attributionClass: ["open edition"],
    atAuction: true,
  },
  entity: savedSearchEntity,
  onComplete: jest.fn(),
  onClosePress: jest.fn(),
}

describe("CreateSavedSearchAlert", () => {
  const mockEnvironment = defaultEnvironment as unknown as ReturnType<typeof createMockEnvironment>
  const notificationPermissions = mockFetchNotificationPermissions(false)

  beforeEach(() => {
    mockEnvironment.mockClear()
    notificationPermissions.mockClear()
  })

  const TestRenderer = (params: Partial<CreateSavedSearchAlertParams>) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <CreateSavedSearchAlert visible params={{ ...defaultParams, ...params }} />
      </ArtworkFiltersStoreProvider>
    )
  }

  const setStatusForPushNotifications = (status: PushAuthorizationStatus) => {
    notificationPermissions.mockImplementation((cb) => {
      cb(null, status)
    })
  }

  const mockOperationByName = async (operationName: string, mockResolvers: MockResolvers) => {
    await waitFor(() => {
      const operation = mockEnvironment.mock.getMostRecentOperation()

      if (operation.fragment.node.name !== operationName) {
        throw new Error("Failed")
      }
    })

    resolveMostRecentRelayOperation(mockEnvironment, mockResolvers)
  }

  it("renders without throwing an error", async () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment)

    expect(getByText("Bid")).toBeTruthy()
    expect(getByText("Open Edition")).toBeTruthy()
  })

  it("should call onClosePress handler when the close button is pressed", () => {
    const onClosePressMock = jest.fn()
    const { getByTestId } = renderWithWrappers(<TestRenderer onClosePress={onClosePressMock} />)

    resolveMostRecentRelayOperation(mockEnvironment)
    fireEvent.press(getByTestId("fancy-modal-header-left-button"))

    expect(onClosePressMock).toBeCalled()
  })

  it("calls onComplete when alert was saved", async () => {
    const onCompleteMock = jest.fn()

    setStatusForPushNotifications(PushAuthorizationStatus.Authorized)
    const { getByTestId, getByText } = renderWithWrappers(
      <TestRenderer onComplete={onCompleteMock} />
    )

    resolveMostRecentRelayOperation(mockEnvironment)

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByText("Save Alert"))

    // Check alert duplicate
    await mockOperationByName("getSavedSearchIdByCriteriaQuery", {
      Me: () => ({
        savedSearch: null,
      }),
    })

    // Update alert
    await mockOperationByName("createSavedSearchAlertMutation", {
      SearchCriteria: () => ({
        internalID: "internalID",
      }),
    })

    await waitFor(() =>
      expect(onCompleteMock).toHaveBeenCalledWith({
        id: "internalID",
      })
    )
  })

  describe("Notification toggles", () => {
    it("email toggle is enabled by default if the user has allowed email notifications", async () => {
      setStatusForPushNotifications(PushAuthorizationStatus.Authorized)
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Viewer: () => ({
          notificationPreferences: [
            { status: "SUBSCRIBED", name: "custom_alerts", channel: "email" },
          ],
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByLabelText("Email Alerts Toggler")).toHaveProp("accessibilityState", {
        selected: true,
      })
    })

    it("email toggle is disabled by default if the user has not allowed email notifications", async () => {
      setStatusForPushNotifications(PushAuthorizationStatus.Authorized)
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Viewer: () => ({
          notificationPreferences: [
            { status: "UNSUBSCRIBED", name: "custom_alerts", channel: "email" },
          ],
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByLabelText("Email Alerts Toggler")).toHaveProp("accessibilityState", {
        selected: false,
      })
    })

    it("push toggle is enabled by default when push permissions are enabled", () => {
      setStatusForPushNotifications(PushAuthorizationStatus.Authorized)
      renderWithWrappers(<TestRenderer />)

      expect(screen.queryByLabelText("Mobile Alerts Toggler")).toHaveProp("accessibilityState", {
        selected: true,
      })
    })

    it("push toggle is disabled by default when push permissions are denied", async () => {
      setStatusForPushNotifications(PushAuthorizationStatus.Denied)
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Viewer: () => ({
          notificationPreferences: [{ status: "SUBSCRIBED" }],
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByLabelText("Mobile Alerts Toggler")).toHaveProp("accessibilityState", {
        selected: false,
      })
    })

    it("push toggle is disabled by default when push permissions are not determined", async () => {
      setStatusForPushNotifications(PushAuthorizationStatus.NotDetermined)
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Viewer: () => ({
          notificationPreferences: [{ status: "SUBSCRIBED" }],
        }),
      })
      await flushPromiseQueue()

      expect(screen.queryByLabelText("Mobile Alerts Toggler")).toHaveProp("accessibilityState", {
        selected: false,
      })
    })
  })
})
