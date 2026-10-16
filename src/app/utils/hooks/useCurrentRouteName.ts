import { internal_navigationRef } from "app/Navigation/Navigation"
import { useEffect, useState } from "react"

/**
 * The name of the route currently on top, kept up to date as navigation happens.
 *
 * Reading `internal_navigationRef.current?.getCurrentRoute()` during render looks
 * equivalent but is not: the ref is mutable, so React never re-renders when the route
 * changes and the value silently goes stale. Anything that gates on "am I still on the
 * screen I was mounted for" needs this instead.
 */
export const useCurrentRouteName = () => {
  const [routeName, setRouteName] = useState<string | undefined>(
    () => internal_navigationRef.current?.getCurrentRoute()?.name
  )

  useEffect(() => {
    const navigation = internal_navigationRef.current

    if (!navigation) {
      return
    }

    // Sync once on mount: the ref can be populated after our initial render.
    setRouteName(navigation.getCurrentRoute()?.name)

    return navigation.addListener("state", () => {
      setRouteName(navigation.getCurrentRoute()?.name)
    })
  }, [])

  return routeName
}
