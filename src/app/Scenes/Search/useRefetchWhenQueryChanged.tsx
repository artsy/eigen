import { Search2Query$variables } from "__generated__/Search2Query.graphql"
import { useEffect } from "react"

interface Props {
  refetch: (updatedVariables: Search2Query$variables) => void
  query: string
}

export const useRefetchWhenQueryChanged = ({ query, refetch }: Props) => {
  useEffect(() => {
    const shouldStartSearching = query.length >= 2

    if (!shouldStartSearching) {
      refetch({ term: query, skipSearchQuery: false })
    }
  }, [query])
}
