import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { StyleSheet, Text, TextStyle, View, ViewProperties, ViewStyle } from "react-native"

import SerifText from "lib/Components/Text/Serif"
import colors from "lib/data/colors"
import fonts from "lib/data/fonts"

import { Metadata_show } from "__generated__/Metadata_show.graphql"

interface Props extends ViewProperties {
  show: Metadata_show
}

class Metadata extends React.Component<Props> {
  render() {
    const partnerName = this.props.show.partner && this.props.show.partner.name
    const showType = this.showTypeString()
    return (
      <View style={styles.container}>
        {!!partnerName && <Text style={styles.sansSerifText}>{partnerName.toUpperCase()}</Text>}
        {!!showType && <Text style={styles.sansSerifText}>{showType}</Text>}
        <SerifText style={styles.serifText}>{this.props.show.name}</SerifText>
        {this.dateAndLocationString()}
        {this.statusText()}
      </View>
    )
  }

  showTypeString() {
    if (this.props.show.kind) {
      const message = this.props.show.kind.toUpperCase() + (this.props.show.kind === "fair" ? " BOOTH" : " SHOW")
      return message
    }
    return null
  }

  dateAndLocationString() {
    const exhibition_period = this.props.show.exhibition_period
    const city = this.props.show.location && this.props.show.location.city

    if (city || exhibition_period) {
      const text = city ? city.trim() + ", " + exhibition_period : exhibition_period
      return <SerifText style={[styles.serifText, { color: "grey" }]}>{text}</SerifText>
    }
    return null
  }

  statusText() {
    if (this.props.show.status_update) {
      const textColor = this.props.show.status === "upcoming" ? "green-regular" : "red-regular"
      return <SerifText style={{ color: colors[textColor] }}>{this.props.show.status_update}</SerifText>
    }
    return null
  }
}

interface Styles {
  container: ViewStyle
  serifText: TextStyle
  sansSerifText: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    justifyContent: "flex-start",
    marginTop: 10,
  },
  serifText: {
    margin: 2,
    marginLeft: 0,
  },
  sansSerifText: {
    fontSize: 12,
    textAlign: "left",
    margin: 2,
    marginLeft: 0,
    fontFamily: fonts["avant-garde-regular"],
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
