import * as Relay from 'react-relay'
import * as React from 'react'
import { View, Text, StyleSheet, ViewProperties } from 'react-native'

import colors from '../../../../data/colors'
import SerifText from '../../text/serif'

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

class Metadata extends React.Component<Props, {}> {

  render() {
    return (
      <View style={styles.container}>
        { this.props.show.partner ? <Text style={styles.sansSerifText}>{this.props.show.partner.name.toUpperCase()}</Text> : null }
        <Text style={styles.sansSerifText}>{this.showTypeString()}</Text>
        <SerifText style={styles.serifText}>{this.props.show.name}</SerifText>
        { this.dateAndLocationString() }
        { this.statusText() }
      </View>
    )
  }

  showTypeString() {
    let message = this.props.show.kind.toUpperCase() + (this.props.show.kind === 'fair' ? ' BOOTH' : ' SHOW')
    return message
  }

  dateAndLocationString() {
    const exhibition_period = this.props.show.exhibition_period
    const city = this.props.show.location && this.props.show.location.city

    if (city || exhibition_period) {
      const string = city ? (city.trim() + ', ' + exhibition_period) : exhibition_period
      return <SerifText style={[styles.serifText, {color: 'grey'}]}>{ string }</SerifText>
    }
    return null
  }

  statusText() {
    if (this.props.show.status_update) {
      let textColor = this.props.show.status === 'upcoming' ? 'green-regular' : 'red-regular'
      return <SerifText style={{color: colors[textColor]}}>{this.props.show.status_update}</SerifText>
    }
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    marginTop: 10,
  } as React.ViewStyle,
  serifText: {
    margin: 2,
    marginLeft: 0,
  } as React.ViewStyle,
  sansSerifText: {
    fontSize: 12,
    textAlign: 'left',
    margin: 2,
    marginLeft: 0,
    fontFamily: 'Avant Garde Gothic ITCW01Dm',
  } as React.ViewStyle,
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
    `
  }
})

interface RelayProps {
  show: {
    kind: string | null,
    name: string | null,
    exhibition_period: string | null,
    status_update: string | null,
    status: string | null,
    partner: {
      name: string | null,
    } | null,
    location: {
      city: string | null,
    } | null,
  },
}
