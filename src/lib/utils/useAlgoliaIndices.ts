import { SearchResponse } from "@algolia/client-search"
import { SearchClient } from "algoliasearch"
import { useCallback, useState } from "react"

interface IndexInfo {
  hasResults: boolean
}

interface IndicesInfo {
  [key: string]: IndexInfo
}

export const useAlgoliaIndices = (client: SearchClient | null, indices?: ReadonlyArray<{ name: string }>) => {
  const [indicesInfo, setIndicesInfo] = useState<IndicesInfo>({})

  const updateIndicesInfo = useCallback(
    async (query: string) => {
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
          const indicesResponse = await client.multipleQueries<SearchResponse>(queries)
          const newIndicesInfo = indicesResponse.results.reduce((acc: IndicesInfo, { index, nbHits }) => {
            if (!!index) {
              acc[index] = { hasResults: !!nbHits }
            }
            return acc
          }, {})
          setIndicesInfo(newIndicesInfo)
        }
      }
    },
    [client, indices]
  )

  return { indicesInfo, updateIndicesInfo }
}
