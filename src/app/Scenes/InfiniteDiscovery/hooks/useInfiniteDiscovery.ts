import { InfiniteDiscoveryContext } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext"

export default () => {
  // state
  const artworkIds = InfiniteDiscoveryContext.useStoreState((state) => state.artworkIds)
  const currentArtworkId = InfiniteDiscoveryContext.useStoreState((state) => state.currentArtworkId)

  // actions
  const goBack = InfiniteDiscoveryContext.useStoreActions((actions) => actions.goBack)
  const goForward = InfiniteDiscoveryContext.useStoreActions((actions) => actions.goForward)

  return { artworkIds, currentArtworkId, goBack, goForward }
}
