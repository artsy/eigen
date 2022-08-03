import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { ModalStack } from "app/navigation/ModalStack"
import { NavStack } from "app/navigation/NavStack"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { BottomTabsNavigator } from "./BottomTabsNavigator"

jest.unmock("react-relay")

jest.unmock("app/NativeModules/LegacyNativeModules")

describe(BottomTabsNavigator, () => {
  it("shows the current tab content", async () => {
    const tree = renderWithWrappersLEGACY(
      <RelayEnvironmentProvider environment={getRelayEnvironment()}>
        <ModalStack>
          <BottomTabsNavigator />
        </ModalStack>
      </RelayEnvironmentProvider>
    )

    expect(
      tree.root.findAll((node) => node.type === NavStack && node.props.id === "home")
    ).toHaveLength(1)

    expect(
      tree.root.findAll((node) => node.type === NavStack && node.props.id === "search")
    ).toHaveLength(0)

    await act(() => {
      LegacyNativeModules.ARScreenPresenterModule.switchTab("search")
    })

    expect(
      tree.root.findAll((node) => node.type === NavStack && node.props.id === "search")
    ).toHaveLength(1)
  })
})
