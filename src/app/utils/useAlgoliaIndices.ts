import { MultipleQueriesResponse, SearchResponse } from "@algolia/client-search"
import { SearchClient } from "algoliasearch"
import { useRef, useState } from "react"

interface IndexInfo {
  hasResults: boolean
}

interface IndicesInfo {
  [key: string]: IndexInfo
}

interface IndicesInfoOptions {
  searchClient: SearchClient | null
  indiceNames: string[]
  onError?: (error: Error) => void
}

export const useAlgoliaIndices = (options: IndicesInfoOptions) => {
  const { searchClient, indiceNames, onError } = options
  const [indicesInfo, setIndicesInfo] = useState<IndicesInfo>({})
  const [loading, setLoading] = useState(false)
  const queryId = useRef(0)

  const getIndicesInfo = (response: MultipleQueriesResponse<SearchResponse<{}>>) => {
    return response.results.reduce((acc: IndicesInfo, { index, nbHits }) => {
      if (!!index) {
        acc[index] = { hasResults: !!nbHits }
      }
      return acc
    }, {})
  }

  const getQueriesFromIndices = (query: string) => {
    return indiceNames.map((indiceName) => ({
      indexName: indiceName,
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

    if (indiceNames.length === 0) {
      return
    }

    const currentQueryId = ++queryId.current

    try {
      setLoading(true)

      const queries = getQueriesFromIndices(query)
      const response = await searchClient.multipleQueries<SearchResponse>(queries)

      if (currentQueryId === queryId.current) {
        const updatedIndicesInfo = getIndicesInfo(response)
        setIndicesInfo(updatedIndicesInfo)
        setLoading(false)
      }
    } catch (error) {
      if (currentQueryId === queryId.current) {
        onError?.(error as Error)
        setLoading(false)
      }
    }
  }

  return { loading, indicesInfo, updateIndicesInfo }
}
