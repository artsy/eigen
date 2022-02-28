import { AlgoliaSearchOptions, SearchClient } from "algoliasearch"
import algoliasearch from "algoliasearch/lite"
import { useEffect, useState } from "react"

export const useAlgoliaClient = (appID: string, apiKey: string, options?: AlgoliaSearchOptions) => {
  const [searchClient, setSearchClient] = useState<SearchClient | null>(null)

  useEffect(() => {
    const algoliaClient = algoliasearch(appID, apiKey, options)
    const client: SearchClient = {
      ...algoliaClient,
      // @ts-ignore
      search(requests) {
        const isEmptyIndexName = requests.every((request) => request.indexName.length === 0)
        const isEmptyQueryName = requests.every((request) => request.params?.query?.length === 0)

        if (isEmptyIndexName || isEmptyQueryName) {
          return Promise.resolve({
            results: requests.map(() => ({
              hits: [],
              nbHits: 0,
              nbPages: 0,
              page: 0,
              processingTimeMS: 0,
            })),
          })
        }

        return algoliaClient.search(requests)
      },
    }
    setSearchClient(client)
  }, [appID, apiKey, options])

  return { searchClient }
}
