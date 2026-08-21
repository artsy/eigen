import { RecordSourceSelectorProxy } from "relay-runtime"

/**
 * ShowFollowButton reads/writes the unaliased `isFollowed` field on Show,
 * while ShowItemRow aliases the same selection as `is_followed`. Relay only
 * gives an aliased field its own storage key when it has arguments to
 * disambiguate; a plain scalar alias like this one still normalizes under
 * the field name, so a single write here already updates both surfaces.
 */
export const setShowFollowed = (
  store: RecordSourceSelectorProxy<{}>,
  nodeID: string,
  isFollowed: boolean
) => {
  const show = store.get(nodeID)

  if (!show) return

  show.setValue(isFollowed, "isFollowed")
}
