import { mount } from "enzyme"
import React from "react"
import { useGlobalState } from "../useGlobalState"

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

    return <div>Hello {n.current}</div>
  }

  it("returns a tuple of [stateContainer, stateSetter]", () => {
    mount(<TestComponent />)

    expect(n.current).toBe(0)

    setN(5)

    expect(n.current).toBe(5)

    setN(-245)

    expect(n.current).toBe(-245)
  })

  it("does not cause the wrapper to be updated by default", () => {
    const wrapper = mount(<TestComponent />)

    expect(wrapper.text()).toBe("Hello 0")

    setN(5)

    expect(wrapper.text()).toBe("Hello 0")

    setN(-245)

    expect(wrapper.text()).toBe("Hello 0")
  })

  it("does cause the wrapper to be updated when listening", () => {
    const wrapper = mount(<TestComponent listen />)

    expect(wrapper.text()).toBe("Hello 0")

    setN(5)

    expect(wrapper.text()).toBe("Hello 5")

    setN(-245)

    expect(wrapper.text()).toBe("Hello -245")
  })
})
