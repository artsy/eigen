import { RecordSourceSelectorProxy } from "relay-runtime"

/**
 * ShowFollowButton reads/writes the unaliased `isFollowed` field on Show,
 * while ShowItemRow reads/writes it aliased as `is_followed`. Relay stores
 * these under separate keys, so any mutation updater touching a Show's
 * follow state must write both to keep every surface in sync.
 */
export const setShowFollowed = (
  store: RecordSourceSelectorProxy<{}>,
  nodeID: string,
  isFollowed: boolean
) => {
  const show = store.get(nodeID)

  if (!show) return

  show.setValue(isFollowed, "isFollowed")
  show.setValue(isFollowed, "is_followed")
}
