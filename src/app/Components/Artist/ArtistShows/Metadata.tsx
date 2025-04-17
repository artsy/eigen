import { Text } from "@artsy/palette-mobile"
import { Metadata_show$data } from "__generated__/Metadata_show.graphql"
import { capitalize } from "lodash"
import React from "react"
import { View, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props extends ViewProps {
  show: Metadata_show$data
}

class Metadata extends React.Component<Props> {
  render() {
    const partnerName = this.props.show.partner && this.props.show.partner.name
    const showType = this.showTypeString()
    return (
      <View>
        {!!partnerName && (
          <Text variant="sm" weight="medium" numberOfLines={1}>
            {partnerName}
          </Text>
        )}
        <Text variant="sm" numberOfLines={1}>
          {this.props.show.name}
        </Text>
        {!!showType && (
          <Text variant="sm" color="mono60">
            {showType}
          </Text>
        )}
        {this.dateAndLocationString()}
        {this.statusText()}
      </View>
    )
  }

  showTypeString() {
    if (this.props.show.kind) {
      const message = this.props.show.kind + (this.props.show.kind === "fair" ? " booth" : " show")
      return capitalize(message)
    }
    return null
  }

  dateAndLocationString() {
    const exhibition_period = this.props.show.exhibition_period
    const city = this.props.show.location && this.props.show.location.city

    if (city || exhibition_period) {
      const text = city ? city.trim() + ", " + exhibition_period : exhibition_period
      return (
        <Text variant="sm" color="mono60">
          {text}
        </Text>
      )
    }
    return null
  }

  statusText() {
    if (this.props.show.status_update) {
      return (
        <Text variant="sm" color="mono60">
          {this.props.show.status_update}
        </Text>
      )
    }
    return null
  }
}

export default createFragmentContainer(Metadata, {
  show: graphql`
    fragment Metadata_show on Show {
      kind
      name
      exhibition_period: exhibitionPeriod(format: SHORT)
      status_update: statusUpdate
      status
      partner {
        ... on Partner {
          name
        }
        ... on ExternalPartner {
          name
        }
      }
      location {
        city
      }
    }
  `,
})
