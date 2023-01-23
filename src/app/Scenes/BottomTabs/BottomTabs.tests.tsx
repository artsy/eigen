import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { ModalStack } from "app/system/navigation/ModalStack"
import { createEnvironment } from "app/system/relay/createEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { act, ReactTestRenderer } from "react-test-renderer"
import useInterval from "react-use/lib/useInterval"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { BottomTabs } from "./BottomTabs"
import { BottomTabsButton } from "./BottomTabsButton"

jest.mock("react-use/lib/useInterval")
jest.unmock("react-relay")
jest.mock("app/system/relay/createEnvironment", () => {
  let env = require("relay-test-utils").createMockEnvironment()
  const mock = {
    createEnvironment: () => env,
    __reset() {
      env = require("relay-test-utils").createMockEnvironment()
    },
  }
  return mock
})
let mockRelayEnvironment = {} as ReturnType<typeof createMockEnvironment>
beforeEach(() => {
  require("app/system/relay/createEnvironment").__reset()
  mockRelayEnvironment = createEnvironment() as any
})

function resolveNotificationsInfoQuery(resolvers: MockResolvers) {
  expect(mockRelayEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(
    "BottomTabsModelFetchNotificationsInfoQuery"
  )
  mockRelayEnvironment.mock.resolveMostRecentOperation((op) =>
    MockPayloadGenerator.generate(op, resolvers)
  )
}

const findButtonByTab = (tree: ReactTestRenderer, tab: ButtonProps["tab"]) => {
  const buttons = tree.root.findAllByType(BottomTabsButton)
  const buttonByTab = buttons.find((button) => (button.props as ButtonProps).tab === tab)

  return buttonByTab
}

const TestWrapper: React.FC<Partial<BottomTabBarProps>> = (props) => {
  return (
    <GlobalStoreProvider>
      <ModalStack>
        {/* @ts-ignore */}
        <BottomTabs state={navigationState} {...props} />
      </ModalStack>
    </GlobalStoreProvider>
  )
}

type ButtonProps = React.ComponentProps<typeof BottomTabsButton>

describe(BottomTabs, () => {
  it(`displays the current unread notifications count`, async () => {
    __globalStoreTestUtils__?.injectState({
      bottomTabs: { sessionState: { unreadCounts: { unreadConversation: 4 } } },
    })
    const tree = renderWithWrappersLEGACY(<TestWrapper />)

    const inboxButton = findButtonByTab(tree, "inbox")
    expect((inboxButton!.props as ButtonProps).badgeCount).toBe(4)

    // need to prevent this test's requests from leaking into the next test
    await flushPromiseQueue()
  })

  it(`displays a blue dot on home icon if there are unread notifications`, async () => {
    __globalStoreTestUtils__?.injectState({
      bottomTabs: { sessionState: { displayUnreadActivityPanelIndicator: true } },
    })
    const tree = renderWithWrappersLEGACY(<TestWrapper />)

    const homeButton = findButtonByTab(tree, "home")
    expect((homeButton!.props as ButtonProps).forceDisplayVisualClue).toBe(true)

    // need to prevent this test's requests from leaking into the next test
    await flushPromiseQueue()
  })

  it(`doesn't display a blue dot on home icon if there are no unread notifications`, async () => {
    __globalStoreTestUtils__?.injectState({
      bottomTabs: { sessionState: { displayUnreadActivityPanelIndicator: false } },
    })
    const tree = renderWithWrappersLEGACY(<TestWrapper />)

    const homeButton = findButtonByTab(tree, "home")
    expect((homeButton!.props as ButtonProps).forceDisplayVisualClue).toBe(false)

    // need to prevent this test's requests from leaking into the next test
    await flushPromiseQueue()
  })

  it(`fetches the notifications info on mount`, async () => {
    const tree = renderWithWrappersLEGACY(<TestWrapper />)

    await flushPromiseQueue()

    expect(mockRelayEnvironment.mock.getAllOperations()).toHaveLength(1)

    resolveNotificationsInfoQuery({
      Me: () => ({
        unreadConversationCount: 5,
        unreadNotificationsCount: 1,
      }),
    })

    await flushPromiseQueue()

    const inboxButton = findButtonByTab(tree, "inbox")
    expect((inboxButton!.props as ButtonProps).badgeCount).toBe(5)

    const homeButton = findButtonByTab(tree, "home")
    expect((homeButton!.props as ButtonProps).forceDisplayVisualClue).toBe(true)
  })

  it(`sets the application icon badge count`, async () => {
    renderWithWrappersLEGACY(<TestWrapper />)

    await flushPromiseQueue()

    expect(mockRelayEnvironment.mock.getAllOperations()).toHaveLength(1)
    resolveNotificationsInfoQuery({
      Me: () => ({
        unreadConversationCount: 9,
        unreadNotificationsCount: 1,
      }),
    })

    await flushPromiseQueue()

    expect(
      LegacyNativeModules.ARTemporaryAPIModule.setApplicationIconBadgeNumber
    ).toHaveBeenCalledWith(10)
  })

  it(`fetches the notifications info once in a while`, async () => {
    let tree: ReactTestRenderer | null = null
    act(() => {
      tree = renderWithWrappersLEGACY(<TestWrapper />)
    })

    expect(useInterval).toHaveBeenCalledWith(expect.any(Function), expect.any(Number))

    await flushPromiseQueue()

    resolveNotificationsInfoQuery({
      Me: () => ({
        unreadConversationCount: 1,
        unreadNotificationsCount: 1,
      }),
    })

    const intervalCallback = (useInterval as jest.Mock).mock.calls[0][0]

    await flushPromiseQueue()

    expect(mockRelayEnvironment.mock.getAllOperations()).toHaveLength(0)
    act(() => intervalCallback())

    await flushPromiseQueue()

    expect(mockRelayEnvironment.mock.getAllOperations()).toHaveLength(1)

    resolveNotificationsInfoQuery({
      Me: () => ({
        unreadConversationCount: 3,
        unreadNotificationsCount: 1,
      }),
    })

    await flushPromiseQueue()

    // @ts-ignore
    const inboxButton = findButtonByTab(tree, "inbox")
    expect((inboxButton!.props as ButtonProps).badgeCount).toBe(3)

    // @ts-ignore
    const homeButton = findButtonByTab(tree, "home")
    expect((homeButton!.props as ButtonProps).forceDisplayVisualClue).toBe(true)
  })

  it("should not be rendered if the `hidesBottomTabs` option is specified", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARArtworkRedesingPhase2: true })

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

    const tree = renderWithWrappersLEGACY(<TestWrapper state={state} />)
    const buttons = tree.root.findAllByType(BottomTabsButton)

    expect(buttons).toHaveLength(0)
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
