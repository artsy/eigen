import { ArtnetArticle, fetchArtnetNews } from "app/Scenes/Articles/Artnet/artnetGateway"
import { useCallback, useEffect, useState } from "react"

export const useArtnetNews = (artistKeys: string[]) => {
  const [articles, setArticles] = useState<ArtnetArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // artistKeys is an array literal; serialize it so the callback identity is
  // stable across renders unless the keys actually change.
  const serializedKeys = JSON.stringify(artistKeys)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await fetchArtnetNews({ artistKeys: JSON.parse(serializedKeys) })
      setArticles(results)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [serializedKeys])

  useEffect(() => {
    load()
  }, [load])

  return { articles, loading, error, refetch: load }
}
