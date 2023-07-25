import { SearchQuery$variables } from "__generated__/SearchQuery.graphql"
import { useEffect } from "react"

interface Props {
  refetch: (updatedVariables: SearchQuery$variables) => void
  query: string
}

export const useRefetchWhenQueryChanged = ({ query, refetch }: Props) => {
  useEffect(() => {
    const shouldStartSearching = query.length >= 2

    if (shouldStartSearching) {
      refetch({ term: query, skipSearchQuery: false })
    }
  }, [query])
}
