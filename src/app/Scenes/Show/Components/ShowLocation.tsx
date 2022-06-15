import { ShowLocation_show$data } from "__generated__/ShowLocation_show.graphql"
import { LocationMapContainer as LocationMap } from "app/Components/LocationMap/LocationMap"
import { Box, BoxProps } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

export interface ShowLocationProps extends BoxProps {
  show: ShowLocation_show$data
}

export const ShowLocation: React.FC<ShowLocationProps> = ({ show, ...rest }) => {
  const location = show.location ?? show.fair?.location

  if (!show.partner || !location) {
    return null
  }

  return (
    <Box {...rest}>
      <LocationMap
        {...(!!show.fair
          ? {
              partnerName: `${show.partner.name} at ${show.fair!.name}`,
              location,
            }
          : {
              partnerName: show.partner.name!,
              location,
            })}
      />
    </Box>
  )
}

export const ShowLocationFragmentContainer = createFragmentContainer(ShowLocation, {
  show: graphql`
    fragment ShowLocation_show on Show {
      partner {
        ... on Partner {
          name
        }
        ... on ExternalPartner {
          name
        }
      }
      fair {
        name
        location {
          ...LocationMap_location
        }
      }
      location {
        ...LocationMap_location
      }
    }
  `,
})
