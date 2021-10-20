import { useEffect } from "react"
import { connectStateResults, StateResultsProvided } from "react-instantsearch-core"
import { RelayRefetchProp } from "react-relay"
import { isAlgoliaApiKeyExpiredError } from "../helpers"
import { AlgoliaSearchResult } from "../types"

interface ContainerProps extends StateResultsProvided<AlgoliaSearchResult> {
  relay: RelayRefetchProp
}

const Container: React.FC<ContainerProps> = (props) => {
  const { error, relay } = props

  const refetch = () => {
    relay.refetch(
      {},
      null,
      (relayError) => {
        if (relayError) {
          // TODO: Handle error (for example, show toast message)
          console.error(relayError)
        }
      },
      { force: true }
    )
  }

  useEffect(() => {
    if (isAlgoliaApiKeyExpiredError(error)) {
      refetch()
    }
  }, [error?.message])

  return null
}

export const RefetchWhenApiKeyExpiredContainer = connectStateResults(Container)
