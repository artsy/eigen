import { MultipleQueriesResponse, SearchResponse } from "@algolia/client-search"
import { SearchClient } from "algoliasearch"
import { useRef, useState } from "react"

interface IndexInfo {
  hasResults: boolean
}

interface IndicesInfo {
  [key: string]: IndexInfo
}

export interface IndicesInfoOptions {
  searchClient: SearchClient | null
  indices?: ReadonlyArray<{ name: string }>
  onError?: (error: Error) => void
}

export const useAlgoliaIndices = (options: IndicesInfoOptions) => {
  const { searchClient, indices = [], onError } = options
  const [indicesInfo, setIndicesInfo] = useState<IndicesInfo>({})
  const [loading, setLoading] = useState(false)
  const lastQuery = useRef<string | null>(null)

  const isCurrentQuery = (query: string) => {
    return lastQuery.current === query
  }

  const getIndicesInfo = (response: MultipleQueriesResponse<SearchResponse<{}>>) => {
    return response.results.reduce((acc: IndicesInfo, { index, nbHits }) => {
      if (!!index) {
        acc[index] = { hasResults: !!nbHits }
      }
      return acc
    }, {})
  }

  const getQueriesFromIndices = (query: string) => {
    return indices.map((index) => ({
      indexName: index.name,
      query,
      params: {
        hitsPerPage: 0,
        analytics: false,
      },
    }))
  }

  const updateIndicesInfo = async (query: string) => {
    if (!searchClient) {
      throw new Error("SearchClient is not specified")
    }

    if (indices.length === 0) {
      return
    }

    lastQuery.current = query

    try {
      setLoading(true)

      const queries = getQueriesFromIndices(query)
      const response = await searchClient.multipleQueries<SearchResponse>(queries)

      if (isCurrentQuery(query)) {
        const updatedIndicesInfo = getIndicesInfo(response)
        setIndicesInfo(updatedIndicesInfo)
      }
    } catch (error) {
      if (isCurrentQuery(query)) {
        console.log("[debug] error", error, query)
        onError?.(error as Error)
      }
    } finally {
      if (isCurrentQuery(query)) {
        setLoading(false)
      }
    }
  }

  return { loading, indicesInfo, updateIndicesInfo }
}
