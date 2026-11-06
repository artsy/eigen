import { FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { createContext, useContext, useMemo, useState } from "react"

interface SearchArtAssistantContextValue {
  query: string
  filters: FilterArray
  setQuery: (query: string) => void
  setFilters: (filters: FilterArray) => void
}

// The defaults are no-ops so the search overlay still works on screens without a provider.
const SearchArtAssistantContext = createContext<SearchArtAssistantContextValue>({
  query: "",
  filters: [],
  setQuery: () => undefined,
  setFilters: () => undefined,
})

// The overlay owns the query and the artworks grid owns the filters. Both sit below the portal
// host, so this carries them up to the Art Assistant sheet.
export const SearchArtAssistantProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<FilterArray>([])

  const value = useMemo(() => ({ query, filters, setQuery, setFilters }), [query, filters])

  return (
    <SearchArtAssistantContext.Provider value={value}>
      {children}
    </SearchArtAssistantContext.Provider>
  )
}

export const useSearchArtAssistantContext = () => useContext(SearchArtAssistantContext)
