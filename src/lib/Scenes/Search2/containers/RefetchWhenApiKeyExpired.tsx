import { useEffect } from "react"
import { connectStateResults, StateResultsProvided } from "react-instantsearch-core"
import { RelayRefetchProp } from "react-relay"
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
          console.log("[debug] error", relayError)
          // TODO: Handle error (for example, show error message)
        }
      },
      { force: true }
    )
  }

  useEffect(() => {
    if (error?.message?.includes("parameter expired")) {
      refetch()
    }
  }, [error?.message])

  return null
}

export const RefetchWhenApiKeyExpiredContainer = connectStateResults(Container)
