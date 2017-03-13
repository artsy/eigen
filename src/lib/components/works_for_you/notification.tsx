import * as Relay from 'react-relay'
import * as React from 'react'
import { View, StyleSheet, ViewProperties } from 'react-native'

import SerifText from '../text/serif'
import Headline from '../text/headline'
import ArtworksGrid from '../artwork_grids/generic_grid'

import colors from '../../../data/colors'

interface Props extends ViewProperties {
  notification: {
    message: string
    date: string
    artists: string
    status: 'READ' | 'UNREAD'
    artworks: any[]
  }
}

class Notification extends React.Component<Props, any> {
  render() {
    const notification = this.props.notification

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Headline style={styles.artistName}>{notification.artists}</Headline>
            <SerifText style={styles.metadata}>{notification.message + ' · ' + notification.date}</SerifText>
          </View>
          { notification.status === 'UNREAD' && <View style={styles.readStatus}/>}
        </View>
        <View style={styles.gridContainer}>
          <ArtworksGrid artworks={notification.artworks}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  } as React.ViewStyle,
  header: {
    flexDirection: 'row',
  } as React.ViewStyle,
  artistName: {
    fontSize: 14
  } as React.ViewStyle,
  metadata: {
    marginTop: 2,
    fontSize: 16,
    color: 'gray',
  } as React.ViewStyle,
  gridContainer: {
    marginTop: 20,
    marginBottom: 20,
  } as React.ViewStyle,
  readStatus: {
    backgroundColor: colors['purple-regular'],
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    right: 0
  } as React.ViewStyle
})

export default Relay.createContainer(Notification, {
  fragments: {
    notification: () => Relay.QL`
      fragment on NotificationsFeedItem {
        date(format: "MMM D")
        message
        artists
        artworks {
          ${ArtworksGrid.getFragment('artworks')}
        }
      }
    `,
  }
})
