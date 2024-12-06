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

    expect(Object.keys(getState())).toEqual(["artworks", "currentArtwork"])
    expect(Object.keys(actions)).toEqual(["goToPreviousArtwork", "goToNextArtwork"])
  })

  describe("goToPreviousArtwork", () => {
    it("sets the current artwork to the previous one in the list of artworks", () => {
      const { getState, actions } = setup({
        artworks: ["1", "2", "3"],
        currentArtwork: "2",
      })
      act(() => actions.goToPreviousArtwork())
      expect(getState().currentArtwork).toEqual("1")
    })

    it("stops at the first artwork", () => {
      const { getState, actions } = setup({
        artworks: ["1", "2", "3"],
        currentArtwork: "1",
      })
      act(() => actions.goToPreviousArtwork())
      expect(getState().currentArtwork).toEqual("1")
    })
  })

  describe("goToNextArtwork", () => {
    it("sets the current artwork to the next one in the list of artworks", () => {
      const { getState, actions } = setup({
        artworks: ["1", "2", "3"],
        currentArtwork: "2",
      })
      act(() => actions.goToNextArtwork())
      expect(getState().currentArtwork).toEqual("3")
    })

    it("stops at the last artwork", () => {
      const { getState, actions } = setup({
        artworks: ["1", "2", "3"],
        currentArtwork: "3",
      })
      act(() => actions.goToNextArtwork())
      expect(getState().currentArtwork).toEqual("3")
    })
  })
})
