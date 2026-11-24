import { Flex, Spinner } from "@artsy/palette-mobile"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NavigationContainer } from "@react-navigation/native"
import { act, screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import {
  PREVIOUS_LAUNCH_COUNT_KEY,
  useReloadedDevNavigationState,
} from "app/system/navigation/useReloadedDevNavigationState"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/system/navigation/useReloadedDevNavigationState", () => ({
  ...jest.requireActual("app/system/navigation/useReloadedDevNavigationState"),
}))

const MOCK_NAVIGATION_STATE_KEY = "MOCK_NAVIGATION_STATE_KEY"

// Queries only see host elements, so record the props the hook's state reaches the container with
const MockNavigationContainer = jest.fn(
  (props: React.ComponentProps<typeof NavigationContainer>) => <NavigationContainer {...props} />
)

const lastInitialState = () => MockNavigationContainer.mock.lastCall?.[0].initialState

// Lets a test look at the loading state before AsyncStorage answers
const deferred = <T,>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

describe("useReloadedDevNavigationState", () => {
  const Test = () => {
    const { isReady, initialState } = useReloadedDevNavigationState(MOCK_NAVIGATION_STATE_KEY)
    if (!isReady) {
      return <Spinner testID="spinner" />
    }

    return (
      <Flex testID="content">
        <MockNavigationContainer initialState={initialState} children={undefined} />
      </Flex>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("when the launch count is different", () => {
    it("should return initialState as undefined", async () => {
      const previousSessionState = deferred<string | null>()
      jest.spyOn(AsyncStorage, "getItem").mockReturnValueOnce(previousSessionState.promise)
      jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce("2")

      await renderWithWrappers(<Test />)

      expect(screen.getByTestId("spinner")).toBeTruthy()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(MOCK_NAVIGATION_STATE_KEY)

      await act(async () => {
        previousSessionState.resolve(JSON.stringify(reactNavigationMockState))
      })
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(PREVIOUS_LAUNCH_COUNT_KEY)

      expect(await screen.findByTestId("content")).toBeTruthy()
      expect(screen.queryByTestId("spinner")).not.toBeOnTheScreen()

      expect(MockNavigationContainer).toHaveBeenCalled()
      expect(lastInitialState()).toBeUndefined()
    })
  })
  describe("when the launch count is the same", () => {
    it("should return the cached nav state", async () => {
      const previousSessionState = deferred<string | null>()
      jest.spyOn(AsyncStorage, "getItem").mockReturnValueOnce(previousSessionState.promise)
      jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce("1")
      jest.spyOn(AsyncStorage, "setItem").mockResolvedValueOnce()

      await renderWithWrappers(<Test />)

      expect(screen.getByTestId("spinner")).toBeTruthy()

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(MOCK_NAVIGATION_STATE_KEY)

      await act(async () => {
        previousSessionState.resolve(JSON.stringify(reactNavigationMockState))
      })

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(PREVIOUS_LAUNCH_COUNT_KEY)

      expect(await screen.findByTestId("content")).toBeTruthy()
      expect(screen.queryByTestId("spinner")).not.toBeOnTheScreen()

      expect(lastInitialState()).toEqual(reactNavigationMockState)
    })
  })
  describe("when DTDisableNavigationStateRehydration is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ DTDisableNavigationStateRehydration: true })
    })

    it("should skip rehydration", async () => {
      jest
        .spyOn(AsyncStorage, "getItem")
        .mockResolvedValueOnce(JSON.stringify(reactNavigationMockState))
      jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce("1")
      jest.spyOn(AsyncStorage, "setItem").mockResolvedValueOnce()

      await renderWithWrappers(<Test />)

      expect(() => screen.getByTestId("spinner")).toThrow()

      expect(AsyncStorage.getItem).not.toHaveBeenCalledWith(MOCK_NAVIGATION_STATE_KEY)

      expect(screen.getByTestId("content")).toBeTruthy()

      expect(MockNavigationContainer).toHaveBeenCalled()
      expect(lastInitialState()).toEqual(undefined)
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
