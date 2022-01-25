import { SearchResponse } from "@algolia/client-search"
import { SearchClient } from "algoliasearch"
import { useCallback, useRef, useState } from "react"

interface IndexInfo {
  hasResults: boolean
}

interface IndicesInfo {
  [key: string]: IndexInfo
}

export const useAlgoliaIndices = (
  client: SearchClient | null,
  indices?: ReadonlyArray<{ name: string }>
) => {
  const [indicesInfo, setIndicesInfo] = useState<IndicesInfo>({})
  const [loading, setLoading] = useState(false)
  const lastQuery = useRef<string | null>(null)

  const updateIndicesInfo = useCallback(
    async (query: string) => {
      lastQuery.current = query

      if (Array.isArray(indices) && indices.length > 0) {
        const queries = indices.map((index) => ({
          indexName: index.name,
          query,
          params: {
            hitsPerPage: 0,
            analytics: false,
          },
        }))

        if (!!client) {
          setLoading(true)
          const indicesResponse = await client.multipleQueries<SearchResponse>(queries)
          if (query === lastQuery.current) {
            const newIndicesInfo = indicesResponse.results.reduce(
              (acc: IndicesInfo, { index, nbHits }) => {
                if (!!index) {
                  acc[index] = { hasResults: !!nbHits }
                }
                return acc
              },
              {}
            )
            setIndicesInfo(newIndicesInfo)
            setLoading(false)
          }
        }
      }
    },
    [client, indices]
  )

  return { loading, indicesInfo, updateIndicesInfo }
}
