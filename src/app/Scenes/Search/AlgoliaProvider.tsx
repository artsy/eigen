import { SearchClient } from "algoliasearch/lite"
import React, { Dispatch, SetStateAction, useMemo } from "react"
import { InstantSearch, InstantSearchProps } from "react-instantsearch-native"
import { SearchPlaceholder } from "./components/placeholders/SearchPlaceholder"

interface AlgoliaProviderProps extends Partial<InstantSearchProps> {
  children: React.ReactNode
}

interface AlgoliaProviderState {
  searchClient: SearchClient | null
  setSearchClient: Dispatch<SetStateAction<SearchClient | null>>
}

export const AlgoliaClientContext = React.createContext<AlgoliaProviderState>({
  searchClient: null,
  setSearchClient: () => {
    // throw new Error('setContext function must be overridden');
  },
})

export const AlgoliaProvider: React.FC<AlgoliaProviderProps> = ({
  children,
  searchState,
  onSearchStateChange,
  indexName,
}) => {
  const [searchClient, setSearchClient] = React.useState<SearchClient | null>(null)
  const value = useMemo(() => ({ searchClient, setSearchClient }), [searchClient])

  if (!searchClient) {
    return <SearchPlaceholder />
  }
  return (
    <AlgoliaClientContext.Provider value={value}>
      <InstantSearch
        searchClient={searchClient}
        indexName={indexName!}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
      >
        {children}
      </InstantSearch>
    </AlgoliaClientContext.Provider>
  )
}
