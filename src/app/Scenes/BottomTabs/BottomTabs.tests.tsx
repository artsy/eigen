import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { screen, waitFor, within } from "@testing-library/react-native"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { BottomTabsButtonProps } from "app/Scenes/BottomTabs/BottomTabsButton"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { ModalStack } from "app/system/navigation/ModalStack"
import { bottomTabsRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers as _renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { ReactElement } from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { RelayMockEnvironment } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { BottomTabs, FETCH_NOTIFICATIONS_INFO_INTERVAL } from "./BottomTabs"

describe(BottomTabs, () => {
  const mockEnvironment = bottomTabsRelayEnvironment as RelayMockEnvironment

  const renderWithWrappers = (component: ReactElement) => {
    return _renderWithWrappers(component, { skipRelay: true })
  }

  const TestWrapper = (props: Partial<BottomTabBarProps>) => {
    return (
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <ModalStack>
          {/* @ts-ignore */}
          <BottomTabs state={navigationState} {...props} />
        </ModalStack>
      </RelayEnvironmentProvider>
    )
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("displays the current unread notifications count", async () => {
    __globalStoreTestUtils__?.injectState({
      bottomTabs: { sessionState: { unreadCounts: { conversations: 4 } } },
    })

    renderWithWrappers(<TestWrapper />)

    const counter = await findBadgeCounterForTab("inbox")
    expect(counter).toHaveTextContent("4")
  })

  describe("a blue dot on home icon", () => {
    it("should be displayed if there are unseen notifications", async () => {
      renderWithWrappers(<TestWrapper />)

      expect(screen.queryByLabelText("home visual clue")).toBeFalsy()

      resolveNotificationsInfoQuery(mockEnvironment, {
        Me: () => ({
          unreadConversationCount: 5,
          unseenNotificationsCount: 1,
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByLabelText("home visual clue")).toBeTruthy()
    })

    it("should NOT be displayed if there are NO unseen notifications", async () => {
      renderWithWrappers(<TestWrapper />)

      expect(screen.queryByLabelText("home visual clue")).toBeFalsy()

      resolveNotificationsInfoQuery(mockEnvironment, {
        Me: () => ({
          unreadConversationCount: 5,
          unseenNotificationsCount: 0,
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByLabelText("home visual clue")).toBeFalsy()
    })
  })

  it("sets the application icon badge count", async () => {
    renderWithWrappers(<TestWrapper />)

    resolveNotificationsInfoQuery(mockEnvironment, {
      Me: () => ({
        unreadConversationCount: 9,
        unseenNotificationsCount: 1,
        unreadNotificationsCount: 1,
      }),
    })

    await flushPromiseQueue()

    const fn = LegacyNativeModules.ARTemporaryAPIModule.setApplicationIconBadgeNumber
    expect(fn).toHaveBeenCalledWith(10)
  })

  it("should not be rendered if the `hidesBottomTabs` option is specified", async () => {
    const state: BottomTabBarProps["state"] = {
      ...navigationState,
      routes: [
        {
          key: "route-key",
          name: "route",
          params: {
            moduleName: "Artwork",
          },
        },
      ],
    }

    renderWithWrappers(<TestWrapper state={state} />)

    expect(screen.queryByLabelText("home bottom tab")).toBeFalsy()
    expect(screen.queryByLabelText("search bottom tab")).toBeFalsy()
    expect(screen.queryByLabelText("inbox bottom tab")).toBeFalsy()
    expect(screen.queryByLabelText("sell bottom tab")).toBeFalsy()
    expect(screen.queryByLabelText("profile bottom tab")).toBeFalsy()
  })

  it("fetches the notifications info on mount", async () => {
    renderWithWrappers(<TestWrapper />)

    expect(mockEnvironment.mock.getAllOperations()).toHaveLength(1)

    resolveNotificationsInfoQuery(mockEnvironment, {
      Me: () => ({
        unreadConversationCount: 5,
        unseenNotificationsCount: 1,
      }),
    })

    const counter = await findBadgeCounterForTab("inbox")
    expect(counter).toHaveTextContent("5")

    const homeButton = screen.getByLabelText("home bottom tab")
    expect(within(homeButton).getByLabelText("home visual clue")).toBeTruthy()
  })

  /**
   * This test case should be placed last, otherwise after `jest.useRealTimers`
   * we will get `setImmediate is not a function` error for the next test cases
   * It is related to this problem: https://github.com/artsy/eigen/blob/main/HACKS.md#jestfake-timers
   */
  it("fetches the notifications info once in a while", async () => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })

    renderWithWrappers(<TestWrapper />)

    // Initial query on mount
    resolveNotificationsInfoQuery(mockEnvironment, {
      Me: () => ({
        unreadConversationCount: 5,
      }),
    })
    expect(mockEnvironment.mock.getAllOperations()).toHaveLength(0)

    // Check badge counters for initial query
    const prevInboxCounter = await findBadgeCounterForTab("inbox")
    expect(prevInboxCounter).toHaveTextContent("5")

    // fast-forward until 1st call should be executed
    jest.advanceTimersByTime(FETCH_NOTIFICATIONS_INFO_INTERVAL)

    expect(mockEnvironment.mock.getAllOperations()).toHaveLength(1)
    resolveNotificationsInfoQuery(mockEnvironment, {
      Me: () => ({
        unreadConversationCount: 3,
      }),
    })

    // Check badge counters
    const currentInboxCounter = await findBadgeCounterForTab("inbox")
    expect(currentInboxCounter).toHaveTextContent("3")

    jest.useRealTimers()
  })
})

const navigationState: BottomTabBarProps["state"] = {
  history: [
    {
      key: "route-key",
      type: "route",
    },
  ],
  index: 0,
  key: "tab-key",
  routeNames: ["route-name"],
  routes: [
    {
      key: "route-key",
      name: "route",
      params: {
        moduleName: "moduleName",
      },
    },
  ],
  stale: false,
  type: "tab",
}

const resolveNotificationsInfoQuery = (
  mockEnvironment: RelayMockEnvironment,
  resolvers: MockResolvers
) => {
  expect(mockEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(
    "BottomTabsModelFetchNotificationsInfoQuery"
  )

  resolveMostRecentRelayOperation(mockEnvironment, resolvers)
}

const findButtonByTabName = (tabName: BottomTabsButtonProps["tab"]) => {
  return screen.getByLabelText(`${tabName} bottom tab`)
}

const findBadgeCounterForTab = async (tabName: BottomTabsButtonProps["tab"]) => {
  const button = findButtonByTabName(tabName)
  const result = await waitFor(() => within(button).getByLabelText("badge count"))

  return result
}
