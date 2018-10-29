import { color, Flex, Sans } from "@artsy/palette"
import { Location_show } from "__generated__/Location_show.graphql"
import qs from "query-string"
import React from "react"

import OpaqueImageView from "lib/Components/OpaqueImageView"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const Image = styled(OpaqueImageView)`
  width: 400;
  height: 300;
`

interface Props {
  show: Location_show
}

// Move to
const GoogleMapsAPIKey = "AIzaSyC8PEDa9CHny20pwkwr4_IDxGKWJpgqud0"

export class Location extends React.Component<Props> {
  render() {
    const { location, partner } = this.props.show
    const { lat, lng } = location.coordinates
    const ImageParams = {
      size: "600x800",
      center: `${lat},${lng}`,
      key: GoogleMapsAPIKey,
    }
    const imageURL = "https://maps.googleapis.com/maps/api/staticmap?" + qs.stringify(ImageParams)
    console.log(imageURL)

    return (
      <Flex>
        <Image imageURL={imageURL} />
        <Sans size="2" color={color("black100")} weight="medium">
          {partner.name}
        </Sans>
        <Sans size="1">{location.address}</Sans>
        <Sans size="1">{location.address_2}</Sans>
        <Sans size="1">{location.day_schedules.start_time!}</Sans>
      </Flex>
    )
  }
}

export const LocationContainer = createFragmentContainer(
  Location,
  graphql`
    fragment Location_show on Show {
      location {
        __id
        id
        city
        address
        address_2
        coordinates {
          lat
          lng
        }
        day_schedules {
          start_time
          end_time
          day_of_week
        }
      }
      partner {
        ... on ExternalPartner {
          name
        }
        ... on Partner {
          name
        }
      }
    }
  `
)
