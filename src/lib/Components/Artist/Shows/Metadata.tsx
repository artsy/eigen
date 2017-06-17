import * as React from "react"
import * as Relay from "react-relay"

import { StyleSheet, Text, TextStyle, View, ViewProperties, ViewStyle } from "react-native"

import colors from "../../../../data/colors"
import SerifText from "../../Text/Serif"

interface Props extends ViewProperties {
  show: {
    name: string
    kind: string
    exhibition_period: string
    location?: {
      city: string
    }
    status_update?: string
    status: string
    partner?: {
      name: string
    }
  }
}

class Metadata extends React.Component<Props, any> {
  render() {
    const partnerName = this.props.show.partner && this.props.show.partner.name
    return (
      <View style={styles.container}>
        {partnerName && <Text style={styles.sansSerifText}>{partnerName.toUpperCase()}</Text>}
        <Text style={styles.sansSerifText}>{this.showTypeString()}</Text>
        <SerifText style={styles.serifText}>{this.props.show.name}</SerifText>
        {this.dateAndLocationString()}
        {this.statusText()}
      </View>
    )
  }

  showTypeString() {
    const message = this.props.show.kind.toUpperCase() + (this.props.show.kind === "fair" ? " BOOTH" : " SHOW")
    return message
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
    fontFamily: "Avant Garde Gothic ITCW01Dm",
  },
})

export default Relay.createContainer(Metadata, {
  fragments: {
    show: () => Relay.QL`
      fragment on PartnerShow {
        kind
        name
        exhibition_period
        status_update
        status
        partner {
          name
        }
        location {
          city
        }
      }
    `,
  },
})

interface RelayProps {
  show: {
    kind: string | null
    name: string | null
    exhibition_period: string | null
    status_update: string | null
    status: string | null
    partner: {
      name: string | null
    } | null
    location: {
      city: string | null
    } | null
  }
}
