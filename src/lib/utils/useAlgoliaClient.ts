import algoliasearch, { AlgoliaSearchOptions, SearchClient } from "algoliasearch"
import { useEffect, useState } from "react"

export const useAlgoliaClient = (appID: string, apiKey: string, options?: AlgoliaSearchOptions) => {
  const [searchClient, setSearchClient] = useState<SearchClient | null>(null)

  useEffect(() => {
    const client = algoliasearch(appID, apiKey, options)
    setSearchClient(client)
  }, [appID, apiKey, options])

  return { searchClient }
}
