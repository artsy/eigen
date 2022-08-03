import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { ModalStack } from "app/navigation/ModalStack"
import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { act, ReactTestRenderer } from "react-test-renderer"
import useInterval from "react-use/lib/useInterval"
import { MockPayloadGenerator } from "relay-test-utils"
import { BottomTabs } from "./BottomTabs"
import { BottomTabsButton } from "./BottomTabsButton"

jest.mock("react-use/lib/useInterval")

function resolveUnreadConversationCountQuery(unreadConversationCount: number) {
  expect(getMockRelayEnvironment().mock.getMostRecentOperation().request.node.operation.name).toBe(
    "BottomTabsModelFetchCurrentUnreadConversationCountQuery"
  )
  getMockRelayEnvironment().mock.resolveMostRecentOperation((op) =>
    MockPayloadGenerator.generate(op, {
      Me() {
        return {
          unreadConversationCount,
        }
      },
    })
  )
}

const TestWrapper: React.FC<{}> = ({}) => {
  return (
    <GlobalStoreProvider>
      <ModalStack>
        <BottomTabs />
      </ModalStack>
    </GlobalStoreProvider>
  )
}

type ButtonProps = React.ComponentProps<typeof BottomTabsButton>

describe(BottomTabs, () => {
  it(`displays the current unread notifications count`, async () => {
    __globalStoreTestUtils__?.injectState({
      bottomTabs: { sessionState: { unreadConversationCount: 4 } },
    })
    const tree = renderWithWrappersLEGACY(<TestWrapper />)

    const inboxButton = tree.root
      .findAllByType(BottomTabsButton)
      .find((button) => (button.props as ButtonProps).tab === "inbox")
    expect((inboxButton!.props as ButtonProps).badgeCount).toBe(4)

    // need to prevent this test's requests from leaking into the next test
    await act(async () => {
      await flushPromiseQueue()
    })
  })

  it(`fetches the current unread conversation count on mount`, async () => {
    const tree = renderWithWrappersLEGACY(<TestWrapper />)

    await act(async () => {
      await flushPromiseQueue()
    })

    expect(getMockRelayEnvironment().mock.getAllOperations()).toHaveLength(1)

    resolveUnreadConversationCountQuery(5)

    await act(async () => {
      await flushPromiseQueue()
    })

    const inboxButton = tree.root
      .findAllByType(BottomTabsButton)
      .find((button) => (button.props as ButtonProps).tab === "inbox")

    expect((inboxButton!.props as ButtonProps).badgeCount).toBe(5)
  })

  it(`sets the application icon badge count`, async () => {
    renderWithWrappersLEGACY(<TestWrapper />)

    await act(async () => {
      await flushPromiseQueue()
    })

    expect(getMockRelayEnvironment().mock.getAllOperations()).toHaveLength(1)
    resolveUnreadConversationCountQuery(9)

    await act(async () => {
      await flushPromiseQueue()
    })

    expect(
      LegacyNativeModules.ARTemporaryAPIModule.setApplicationIconBadgeNumber
    ).toHaveBeenCalledWith(9)
  })

  it(`fetches the current unread conversation count once in a while`, async () => {
    let tree: ReactTestRenderer | null = null
    act(() => {
      tree = renderWithWrappersLEGACY(<TestWrapper />)
    })

    expect(useInterval).toHaveBeenCalledWith(expect.any(Function), expect.any(Number))

    await act(async () => {
      await flushPromiseQueue()
    })

    resolveUnreadConversationCountQuery(1)

    const intervalCallback = (useInterval as jest.Mock).mock.calls[0][0]

    await act(async () => {
      await flushPromiseQueue()
    })

    expect(getMockRelayEnvironment().mock.getAllOperations()).toHaveLength(0)
    act(() => intervalCallback())

    await act(async () => {
      await flushPromiseQueue()
    })

    expect(getMockRelayEnvironment().mock.getAllOperations()).toHaveLength(1)

    resolveUnreadConversationCountQuery(3)

    await act(async () => {
      await flushPromiseQueue()
    })
    // @ts-ignore
    const inboxButton = tree.root
      .findAllByType(BottomTabsButton)
      // @ts-ignore
      .find((button) => (button.props as ButtonProps).tab === "inbox")

    expect((inboxButton!.props as ButtonProps).badgeCount).toBe(3)
  })
})
