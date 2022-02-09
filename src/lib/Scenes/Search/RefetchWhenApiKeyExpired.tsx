import { Search_system$key } from "__generated__/Search_system.graphql"
import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { useEffect } from "react"
import { connectStateResults, StateResultsProvided } from "react-instantsearch-core"
import { RefetchFnDynamic } from "react-relay"
import { isAlgoliaApiKeyExpiredError } from "./helpers"
import { AlgoliaSearchResult } from "./types"

interface ContainerProps extends StateResultsProvided<AlgoliaSearchResult> {
  refetch: RefetchFnDynamic<SearchQuery, Search_system$key>
}

const Container: React.FC<ContainerProps> = (props) => {
  const { error, refetch } = props

  useEffect(() => {
    if (isAlgoliaApiKeyExpiredError(error)) {
      refetch({ fetchPolicy: "network-only" })
    }
  }, [error?.message])

  return null
}

export const RefetchWhenApiKeyExpiredContainer = connectStateResults(Container)
