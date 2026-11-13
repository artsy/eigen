import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useEffect, useState } from "react"

export interface ArtistSearchResult {
  id: string
  name: string
  worksCount: number
}

export const useArtistSearch = (query: string, userEmail?: string) => {
  const [results, setResults] = useState<ArtistSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const { debouncedValue } = useDebouncedValue({ value: query, delay: 300 })

  useEffect(() => {
    if (!debouncedValue) {
      return
    }

    setLoading(true)
    console.log(`Artist search by ${userEmail}: ${debouncedValue}`)

    fetch("https://api.artsy.net/api/v1/match/artists?term=" + debouncedValue)
      .then((response) => response.json())
      .then((json) => {
        setResults(
          json.map((artist: any) => ({
            id: artist._id,
            name: artist.name,
            worksCount: artist.published_artworks_count,
          }))
        )
        setLoading(false)
      })
      .catch(() => {})
  }, [debouncedValue])

  return { results, loading }
}
