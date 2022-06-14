import { ShowHours_show$data } from "__generated__/ShowHours_show.graphql"
import { BoxProps } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ShowLocationHoursFragmentContainer as ShowLocationHours } from "./ShowLocationHours"

export interface ShowHoursProps extends BoxProps {
  show: ShowHours_show$data
}

export const ShowHours: React.FC<ShowHoursProps> = ({ show, ...rest }) => {
  const location = show.location ?? show.fair?.location

  if (!location) {
    return null
  }

  return <ShowLocationHours location={location} {...rest} />
}

export const ShowHoursFragmentContainer = createFragmentContainer(ShowHours, {
  show: graphql`
    fragment ShowHours_show on Show {
      id
      location {
        ...ShowLocationHours_location
      }
      fair {
        location {
          ...ShowLocationHours_location
        }
      }
    }
  `,
})
