import { ArtnetArticleDetail, fetchArtnetArticle } from "app/Scenes/Articles/Artnet/artnetGatewayV2"
import { useCallback, useEffect, useState } from "react"

export const useArtnetArticle = (uri: string) => {
  const [article, setArticle] = useState<ArtnetArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchArtnetArticle(uri)
      setArticle(result)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [uri])

  useEffect(() => {
    load()
  }, [load])

  return { article, loading, error, refetch: load }
}
