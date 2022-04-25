import { useEffect } from "react"
import { connectStateResults, StateResultsProvided } from "react-instantsearch-core"
import { isAlgoliaApiKeyExpiredError } from "./helpers"
import { AlgoliaSearchResult } from "./types"

interface ContainerProps extends StateResultsProvided<AlgoliaSearchResult> {
  refetch: () => void
}

const Container: React.FC<ContainerProps> = (props) => {
  const { error, refetch } = props

  useEffect(() => {
    if (isAlgoliaApiKeyExpiredError(error)) {
      refetch()
    }
  }, [error?.message])

  return null
}

export const RefetchWhenApiKeyExpiredContainer = connectStateResults(Container)
