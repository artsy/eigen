import { renderHook, act } from "@testing-library/react-hooks"
import { InfiniteDiscoveryContext } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext"
import useInfiniteDiscovery from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscovery"

jest.mock("app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext", () => ({
  InfiniteDiscoveryContext: {
    useStoreState: jest.fn(),
    useStoreActions: jest.fn(),
  },
}))

describe("useInfiniteDiscovery", () => {
  const mockUseStoreState = InfiniteDiscoveryContext.useStoreState as jest.Mock
  const mockUseStoreActions = InfiniteDiscoveryContext.useStoreActions as jest.Mock
  const mockGoBack = jest.fn()
  const mockGoForward = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseStoreState.mockImplementation((selector) => {
      /**
       * The `selector` parameter will be a function that returns the state value we are interested
       * in. We can use the `toString` method to get the string representation of the function and
       * mock the state value the selector is interested in. For example:
       *
       *   function (state) {
       *     return state.artworkIds;
       *   }
       */
      console.log(selector.toString())
      if (selector.toString().includes("artworkIds")) return ["1", "2", "3"]
      if (selector.toString().includes("currentArtworkId")) return "2"
    })

    mockUseStoreActions.mockImplementation((selector) => {
      if (selector.toString().includes("goBack")) return mockGoBack
      if (selector.toString().includes("goForward")) return mockGoForward
    })
  })

  it("calls goBack from the context when goBack is called", () => {
    const { result } = renderHook(() => useInfiniteDiscovery())
    act(() => {
      result.current.goBack()
    })
    expect(mockGoBack).toHaveBeenCalled()
  })

  it("calls goForward from the context when goForward is called", () => {
    const { result } = renderHook(() => useInfiniteDiscovery())
    act(() => {
      result.current.goForward()
    })
    expect(mockGoForward).toHaveBeenCalled()
  })
})
