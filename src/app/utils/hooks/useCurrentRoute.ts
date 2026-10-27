import { internal_navigationRef } from "app/Navigation/Navigation"
import { useEffect, useState } from "react"

export interface CurrentRoute {
  name: string | undefined
  /**
   * Identifies the route *instance*, not its type. Two artist screens stacked on each
   * other share a name, so anything asking "am I still on the screen I was mounted for"
   * has to compare keys — a name comparison says yes after pushing a second one.
   */
  key: string | undefined
}

/**
 * The route on top right now, read straight from the navigator. Only meaningful during
 * render when paired with `useCurrentRoute`, which is what re-renders you when it moves.
 */
export const readCurrentRoute = (): CurrentRoute => {
  const route = internal_navigationRef.current?.getCurrentRoute()
  return { name: route?.name, key: route?.key }
}

/**
 * The route currently on top, kept up to date as navigation happens.
 *
 * Reading `internal_navigationRef.current?.getCurrentRoute()` during render looks
 * equivalent but is not: the ref is mutable, so React never re-renders when the route
 * changes and the value silently goes stale.
 */
export const useCurrentRoute = (): CurrentRoute => {
  const [route, setRoute] = useState<CurrentRoute>(readCurrentRoute)

  useEffect(() => {
    const navigation = internal_navigationRef.current

    if (!navigation) {
      return
    }

    // Keep the previous object when nothing we care about moved: "state" also fires for
    // param changes, and a fresh object each time would re-render every consumer.
    const sync = () =>
      setRoute((previous) => {
        const next = readCurrentRoute()
        return previous.name === next.name && previous.key === next.key ? previous : next
      })

    // Sync once on mount: the ref can be populated after our initial render.
    sync()

    return navigation.addListener("state", sync)
  }, [])

  return route
}
