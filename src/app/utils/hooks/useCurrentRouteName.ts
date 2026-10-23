import { useCurrentRoute } from "app/utils/hooks/useCurrentRoute"

/**
 * The name of the route currently on top, kept up to date as navigation happens.
 *
 * Use `useCurrentRoute` instead when you need to tell two instances of the same route
 * apart — the name is shared by every artist screen, every artwork screen, and so on.
 */
export const useCurrentRouteName = () => useCurrentRoute().name
