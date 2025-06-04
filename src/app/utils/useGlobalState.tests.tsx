import { act, renderHook } from "@testing-library/react-hooks"
import { screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"
import { useGlobalState } from "./useGlobalState"

describe(useGlobalState, () => {
  let [n, setN] = [null, null] as any

  beforeEach(() => {
    n = null
    setN = null
  })

  function TestComponent({ listen }: { listen?: boolean }) {
    ;[n, setN] = useGlobalState(0)

    if (listen) {
      n.useUpdates()
    }

    return <Text>Hello {n.current}</Text>
  }

  it("returns a tuple of [stateContainer, stateSetter]", () => {
    const { result } = renderHook(() => {
      const [_n, _setN] = useGlobalState(0)
      return { n: _n, setN: _setN }
    })

    expect(result.current.n.current).toBe(0)

    act(() => result.current.setN(5))

    expect(result.current.n.current).toBe(5)

    act(() => result.current.setN(-245))

    expect(result.current.n.current).toBe(-245)
  })

  it("does not cause the wrapper to be updated by default", () => {
    renderWithWrappers(<TestComponent />)

    expect(screen.getByText("Hello 0")).toBeOnTheScreen()

    act(() => setN(5))

    expect(screen.getByText("Hello 0")).toBeOnTheScreen()

    act(() => setN(-245))

    expect(screen.getByText("Hello 0")).toBeOnTheScreen()
  })

  it("does cause the wrapper to be updated when listening", () => {
    renderWithWrappers(<TestComponent listen />)

    expect(screen.getByText("Hello 0")).toBeOnTheScreen()

    act(() => setN(5))

    expect(screen.getByText("Hello 5")).toBeOnTheScreen()

    act(() => setN(-245))

    expect(screen.getByText("Hello -245")).toBeOnTheScreen()
  })
})
