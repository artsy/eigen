import { navigate, NavigateOptions } from "app/system/navigation/navigate"
import { merge } from "lodash"

interface UseNavigateToPagebleRouteProps<T> {
  artworks: ReadonlyArray<T>
}

export interface PageableRouteProps {
  navigateToPageableRoute: (url: string, options?: NavigateOptions) => void
}

export function useNavigateToPageableRoute<T extends { slug: string }>(
  props: UseNavigateToPagebleRouteProps<T>
): PageableRouteProps {
  // TODO: Currently limited to artworks, but could be expanded to other entities
  const slugs = props.artworks.map((artwork) => artwork.slug)

  const navigateToPageableRoute = (url: string, options: NavigateOptions = {}) => {
    navigate(
      url,
      merge(options, {
        passProps: {
          pageableSlugs: slugs,
        },
      })
    )
  }

  return {
    navigateToPageableRoute,
  }
}
