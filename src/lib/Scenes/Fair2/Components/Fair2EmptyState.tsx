import { Fair2EmptyState_fair } from "__generated__/Fair2EmptyState_fair.graphql"
import { Message } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Fair2EmptyStateProps {
  fair: Fair2EmptyState_fair
}

const Fair2EmptyState: React.FC<Fair2EmptyStateProps> = ({ fair }) => {
  if (!!fair.isActive) {
    return null
  }

  const message = [
    "This fair is currently unavailable.",
    ...(fair.endAt !== null && Date.parse(fair.endAt) > Date.now()
      ? [`Please check back closer to the fair for artworks.`]
      : []),
  ].join(" ")

  return <Message mx={2}>{message}</Message>
}

export const Fair2EmptyStateFragmentContainer = createFragmentContainer(Fair2EmptyState, {
  fair: graphql`
    fragment Fair2EmptyState_fair on Fair {
      isActive
      endAt
    }
  `,
})
