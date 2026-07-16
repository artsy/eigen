import {
  ArtnetFilterFacets,
  fetchArtnetFilterFacets,
} from "app/Scenes/Articles/Artnet/artnetGatewayV2"
import { useEffect, useState } from "react"

const EMPTY_FACETS: ArtnetFilterFacets = { sections: [], topics: [], authors: [] }

/**
 * Loads the facet option lists (sections/topics/authors) that populate the
 * filter modal. `enabled` lets the caller defer the fetch until the modal is
 * first opened.
 */
export const useArtnetFilterFacets = (enabled: boolean) => {
  const [facets, setFacets] = useState<ArtnetFilterFacets>(EMPTY_FACETS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!enabled || loaded) {
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchArtnetFilterFacets()
      .then((result) => {
        if (!cancelled) {
          setFacets(result)
          setLoaded(true)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e as Error)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [enabled, loaded])

  return { facets, loading, error }
}
