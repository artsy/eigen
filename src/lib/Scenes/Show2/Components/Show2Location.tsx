import { Show2Location_show } from "__generated__/Show2Location_show.graphql"
import { LocationMapContainer as LocationMap } from "lib/Components/LocationMap"
import { Box, BoxProps } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

export interface Show2LocationProps extends BoxProps {
  show: Show2Location_show
}

export const Show2Location: React.FC<Show2LocationProps> = ({ show, ...rest }) => {
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

export const Show2LocationFragmentContainer = createFragmentContainer(Show2Location, {
  show: graphql`
    fragment Show2Location_show on Show {
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
