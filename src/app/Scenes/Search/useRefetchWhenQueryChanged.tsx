import { Search2Query$variables } from "__generated__/Search2Query.graphql"
import { useEffect } from "react"

interface Props {
  refetch: (updatedVariables: Search2Query$variables) => void
  query: string
}

export const useRefetchWhenQueryChanged = ({ query, refetch }: Props) => {
  useEffect(() => {
    refetch({ term: query })
  }, [query])
}
