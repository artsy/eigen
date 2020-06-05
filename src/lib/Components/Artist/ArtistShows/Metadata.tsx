import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { StyleSheet, View, ViewProperties, ViewStyle } from "react-native"

import { Sans } from "@artsy/palette"
import { Metadata_show } from "__generated__/Metadata_show.graphql"
import { capitalize } from "lodash"

interface Props extends ViewProperties {
  show: Metadata_show
}

class Metadata extends React.Component<Props> {
  render() {
    const partnerName = this.props.show.partner && this.props.show.partner.name
    const showType = this.showTypeString()
    return (
      <View style={[styles.container, { overflow: "hidden", flex: 0 }]}>
        {!!partnerName && (
          <Sans size="3t" weight="medium" numberOfLines={1}>
            {partnerName}
          </Sans>
        )}
        <Sans size="3t" numberOfLines={1}>
          {this.props.show.name}
        </Sans>
        {!!showType && (
          <Sans size="3t" color="black60">
            {showType}
          </Sans>
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
        <Sans size="3t" color="black60">
          {text}
        </Sans>
      )
    }
    return null
  }

  statusText() {
    if (this.props.show.status_update) {
      return (
        <Sans size="3" color="black60">
          {this.props.show.status_update}
        </Sans>
      )
    }
    return null
  }
}

interface Styles {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    justifyContent: "flex-start",
  },
})

export default createFragmentContainer(Metadata, {
  show: graphql`
    fragment Metadata_show on Show {
      kind
      name
      exhibition_period: exhibitionPeriod
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
