import { Show2Hours_show } from "__generated__/Show2Hours_show.graphql"
import { BoxProps } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Show2LocationHoursFragmentContainer as Show2LocationHours } from "./Show2LocationHours"

export interface Show2HoursProps extends BoxProps {
  show: Show2Hours_show
}

export const Show2Hours: React.FC<Show2HoursProps> = ({ show, ...rest }) => {
  if (!!show.fair?.location) {
    return <Show2LocationHours location={show.fair.location} {...rest} />
  }

  if (show.location) {
    return <Show2LocationHours location={show.location} {...rest} />
  }

  return null
}

export const Show2HoursFragmentContainer = createFragmentContainer(Show2Hours, {
  show: graphql`
    fragment Show2Hours_show on Show {
      id
      location {
        ...Show2LocationHours_location
      }
      fair {
        location {
          ...Show2LocationHours_location
        }
      }
    }
  `,
})
