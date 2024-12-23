import { act, renderHook } from "@testing-library/react-native"
import {
  InfiniteDiscoveryContext,
  InfiniteDiscoveryContextModel,
  initialModel,
} from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext"

describe("InfiniteDiscoveryContext", () => {
  const setup = (fixtureModel: Partial<InfiniteDiscoveryContextModel>) => {
    const view = renderHook(
      () => ({
        state: InfiniteDiscoveryContext.useStoreState((state) => state),
        actions: InfiniteDiscoveryContext.useStoreActions((action) => action),
      }),
      {
        wrapper: ({ children }: any) => (
          <InfiniteDiscoveryContext.Provider runtimeModel={{ ...initialModel, ...fixtureModel }}>
            {children}
          </InfiniteDiscoveryContext.Provider>
        ),
      }
    )

    return {
      getState: () => view.result.current.state,
      actions: view.result.current.actions,
    }
  }

  it("sets up intial state and action helpers", () => {
    const { getState, actions } = setup({})

    expect(Object.keys(getState())).toEqual(["count", "currentIndex"])
    expect(Object.keys(actions)).toEqual(["goToPrevious", "goToNext"])
  })

  describe("goToPrevious", () => {
    it("sets the current artwork to the previous one in the list of artworks", () => {
      const { getState, actions } = setup({
        count: 3,
        currentIndex: 2,
      })
      act(() => actions.goToPrevious())
      expect(getState().currentIndex).toEqual(1)
    })

    it("stops at the first artwork", () => {
      const { getState, actions } = setup({
        count: 3,
        currentIndex: 0,
      })
      act(() => actions.goToPrevious())
      expect(getState().currentIndex).toEqual(0)
    })
  })

  describe("goToNext", () => {
    it("sets the current artwork to the next one in the list of artworks", () => {
      const { getState, actions } = setup({
        count: 3,
        currentIndex: 1,
      })
      act(() => actions.goToNext())
      expect(getState().currentIndex).toEqual(2)
    })

    it("stops at the last artwork", () => {
      const { getState, actions } = setup({
        count: 3,
        currentIndex: 2,
      })
      act(() => actions.goToNext())
      expect(getState().currentIndex).toEqual(2)
    })
  })
})
