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

    expect(Object.keys(getState())).toEqual(["artworkIds", "currentArtworkId"])
    expect(Object.keys(actions)).toEqual(["goBack", "goForward"])
  })

  describe("goBack", () => {
    it("sets the current artwork to the previous one in the list of artworks", () => {
      const { getState, actions } = setup({
        artworkIds: ["1", "2", "3"],
        currentArtworkId: "2",
      })
      act(() => actions.goBack())
      expect(getState().currentArtworkId).toEqual("1")
    })

    it("stops at the first artwork", () => {
      const { getState, actions } = setup({
        artworkIds: ["1", "2", "3"],
        currentArtworkId: "1",
      })
      act(() => actions.goBack())
      expect(getState().currentArtworkId).toEqual("1")
    })
  })

  describe("goForward", () => {
    it("sets the current artwork to the next one in the list of artworks", () => {
      const { getState, actions } = setup({
        artworkIds: ["1", "2", "3"],
        currentArtworkId: "2",
      })
      act(() => actions.goForward())
      expect(getState().currentArtworkId).toEqual("3")
    })

    it("stops at the last artwork", () => {
      const { getState, actions } = setup({
        artworkIds: ["1", "2", "3"],
        currentArtworkId: "3",
      })
      act(() => actions.goForward())
      expect(getState().currentArtworkId).toEqual("3")
    })
  })
})
