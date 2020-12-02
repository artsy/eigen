import { Show2ArtworksEmptyState_show } from "__generated__/Show2ArtworksEmptyState_show.graphql"
import { Box, BoxProps, Message } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

export interface Show2ArtworksEmptyStateProps extends BoxProps {
  show: Show2ArtworksEmptyState_show
}

export const Show2ArtworksEmptyState: React.FC<Show2ArtworksEmptyStateProps> = ({ show, ...rest }) => {
  const message = [
    `This ${Boolean(show.isFairBooth) ? "fair booth" : "show"} is currently unavailable.`,

    ...(show.status !== "closed"
      ? [`Please check back closer to the ${Boolean(show.isFairBooth) ? "fair" : "show"} for artworks.`]
      : []),
  ].join(" ")

  return (
    <Box {...rest}>
      <Message>{message}</Message>
    </Box>
  )
}

export const Show2ArtworksEmptyStateFragmentContainer = createFragmentContainer(Show2ArtworksEmptyState, {
  show: graphql`
    fragment Show2ArtworksEmptyState_show on Show {
      isFairBooth
      status
    }
  `,
})
