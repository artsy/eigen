import { act, renderHook, screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useGlobalState } from "app/utils/useGlobalState"
import { Text } from "react-native"

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

  it("returns a tuple of [stateContainer, stateSetter]", async () => {
    const { result } = await renderHook(() => {
      const [_n, _setN] = useGlobalState(0)
      return { n: _n, setN: _setN }
    })

    expect(result.current.n.current).toBe(0)

    await act(() => result.current.setN(5))

    expect(result.current.n.current).toBe(5)

    await act(() => result.current.setN(-245))

    expect(result.current.n.current).toBe(-245)
  })

  it("does not cause the wrapper to be updated by default", async () => {
    await renderWithWrappers(<TestComponent />)

    expect(screen.getByText("Hello 0")).toBeOnTheScreen()

    await act(() => setN(5))

    expect(screen.getByText("Hello 0")).toBeOnTheScreen()

    await act(() => setN(-245))

    expect(screen.getByText("Hello 0")).toBeOnTheScreen()
  })

  it("does cause the wrapper to be updated when listening", async () => {
    await renderWithWrappers(<TestComponent listen />)

    expect(screen.getByText("Hello 0")).toBeOnTheScreen()

    await act(() => setN(5))

    expect(screen.getByText("Hello 5")).toBeOnTheScreen()

    await act(() => setN(-245))

    expect(screen.getByText("Hello -245")).toBeOnTheScreen()
  })
})
