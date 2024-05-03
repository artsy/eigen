import { Flex, Spinner } from "@artsy/palette-mobile"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NavigationContainer } from "@react-navigation/native"
import { screen } from "@testing-library/react-native"
import {
  PREVIOUS_LAUNCH_COUNT_KEY,
  useReloadedDevNavigationState,
} from "app/system/navigation/useReloadedDevNavigationState"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/system/navigation/useReloadedDevNavigationState", () => ({
  ...jest.requireActual("app/system/navigation/useReloadedDevNavigationState"),
}))

const MOCK_NAVIGATION_STATE_KEY = "MOCK_NAVIGATION_STATE_KEY"

describe("useReloadedDevNavigationState", () => {
  const Test = () => {
    const { isReady, initialState } = useReloadedDevNavigationState(MOCK_NAVIGATION_STATE_KEY)
    if (!isReady) {
      return <Spinner testID="spinner" />
    }

    return (
      <Flex testID="content">
        <NavigationContainer initialState={initialState} children={undefined} />
      </Flex>
    )
  }
  describe("when the launch count is different", () => {
    it("should return initialState as undefined", async () => {
      jest
        .spyOn(AsyncStorage, "getItem")
        .mockResolvedValueOnce(JSON.stringify(reactNavigationMockState))
      jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce("2")

      renderWithWrappers(<Test />)

      expect(screen.getByTestId("spinner")).toBeTruthy()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(MOCK_NAVIGATION_STATE_KEY)

      await flushPromiseQueue()
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(PREVIOUS_LAUNCH_COUNT_KEY)

      expect(screen.getByTestId("content")).toBeTruthy()

      // eslint-disable-next-line testing-library/no-node-access
      const navigationContainerProps = screen.getByTestId("content").children[0]
      const injectedState = (navigationContainerProps as any).initialState

      expect(injectedState).toBeUndefined()
    })
  })
  describe("when the launch count is the same", () => {
    it("should return the cached nav state", async () => {
      jest
        .spyOn(AsyncStorage, "getItem")
        .mockResolvedValueOnce(JSON.stringify(reactNavigationMockState))
      jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce("1")
      jest.spyOn(AsyncStorage, "setItem").mockResolvedValueOnce()

      renderWithWrappers(<Test />)

      expect(screen.getByTestId("spinner")).toBeTruthy()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(MOCK_NAVIGATION_STATE_KEY)

      await flushPromiseQueue()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(PREVIOUS_LAUNCH_COUNT_KEY)

      expect(screen.getByTestId("content")).toBeTruthy()

      // eslint-disable-next-line testing-library/no-node-access
      const navigationContainerProps = screen.getByTestId("content").children[0]
      const injectedState = (navigationContainerProps as any).props.initialState

      expect(injectedState).toEqual(reactNavigationMockState)
    })
  })
})

const reactNavigationMockState = {
  stale: false,
  type: "stack",
  key: "stack-LEbgsfCrk58Azst_eQf7E",
  index: 0,
  routeNames: ["root", "modal"],
  routes: [
    {
      key: "root-RjdKJsGMsDPNx_XOTYmaO",
      name: "root",
      state: {
        stale: false,
        type: "tab",
        key: "tab-EkhCU3xfg4tafYTHJfpa_",
        index: 1,
        routeNames: ["home", "search", "inbox", "sell", "profile"],
        history: [
          {
            type: "route",
            key: "home-80WwYAYCWC97E5JXjusEK",
          },
          {
            type: "route",
            key: "search-ayBSABdlZ6fJMuhv637um",
          },
        ],
        routes: [
          {
            name: "home",
            key: "home-80WwYAYCWC97E5JXjusEK",
            params: {
              tabName: "home",
              rootModuleName: "Home",
            },
            state: {
              stale: false,
              type: "stack",
              key: "stack-tDwfR6H2yq_4XfnsAQsjr",
              index: 0,
              routeNames: ["screen:home"],
              routes: [
                {
                  key: "screen:home-G-LDc6uHke9rXjL7_sCz_",
                  name: "screen:home",
                  params: {
                    moduleName: "Home",
                    stackID: "home",
                  },
                },
              ],
            },
          },
          {
            name: "search",
            key: "search-ayBSABdlZ6fJMuhv637um",
            params: {
              tabName: "search",
              rootModuleName: "Search",
            },
            state: {
              stale: false,
              type: "stack",
              key: "stack-6brqU5YeNzGKxN0zvAXc2", // pragma: allowlist secret
              index: 0,
              routeNames: ["screen:search"],
              routes: [
                {
                  key: "screen:search-fNdUT0VlTN7Ht3mZuDJWe",
                  name: "screen:search",
                  params: {
                    moduleName: "Search",
                    stackID: "search",
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
}
