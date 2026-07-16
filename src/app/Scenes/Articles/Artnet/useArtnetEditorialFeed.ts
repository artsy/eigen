import {
  ArtnetEditorialFilters,
  ArtnetFeedArticle,
  fetchArtnetEditorialFeed,
} from "app/Scenes/Articles/Artnet/artnetGatewayV2"
import { useCallback, useEffect, useState } from "react"

export const useArtnetEditorialFeed = (filters: ArtnetEditorialFilters) => {
  const [articles, setArticles] = useState<ArtnetFeedArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [endCursor, setEndCursor] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)

  // serialize so the callbacks are stable unless the filters actually change
  const serializedFilters = JSON.stringify(filters)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const page = await fetchArtnetEditorialFeed({ filters: JSON.parse(serializedFilters) })
      setArticles(page.articles)
      setEndCursor(page.endCursor)
      setHasNextPage(page.hasNextPage)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [serializedFilters])

  const loadMore = useCallback(async () => {
    if (!hasNextPage || loadingMore || loading) {
      return
    }
    setLoadingMore(true)
    try {
      const page = await fetchArtnetEditorialFeed({
        filters: JSON.parse(serializedFilters),
        after: endCursor,
      })
      setArticles((prev) => [...prev, ...page.articles])
      setEndCursor(page.endCursor)
      setHasNextPage(page.hasNextPage)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoadingMore(false)
    }
  }, [serializedFilters, endCursor, hasNextPage, loadingMore, loading])

  useEffect(() => {
    load()
  }, [load])

  return { articles, loading, loadingMore, error, hasNextPage, loadMore, refetch: load }
}
