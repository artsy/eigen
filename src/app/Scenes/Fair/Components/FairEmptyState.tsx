import { FairEmptyState_fair } from "__generated__/FairEmptyState_fair.graphql"
import { SimpleMessage } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface FairEmptyStateProps {
  fair: FairEmptyState_fair
}

const FairEmptyState: React.FC<FairEmptyStateProps> = ({ fair }) => {
  if (!!fair.isActive) {
    return null
  }

  const message = [
    "This fair is currently unavailable.",
    ...(fair.endAt !== null && Date.parse(fair.endAt) > Date.now()
      ? [`Please check back closer to the fair for artworks.`]
      : []),
  ].join(" ")

  return <SimpleMessage mx={2}>{message}</SimpleMessage>
}

export const FairEmptyStateFragmentContainer = createFragmentContainer(FairEmptyState, {
  fair: graphql`
    fragment FairEmptyState_fair on Fair {
      isActive
      endAt
    }
  `,
})
