import * as Relay from 'react-relay'
import * as React from 'react'
import { StyleSheet, View, ViewProperties } from 'react-native'

import SerifText from '../text/serif'
import RelatedArtist from './related_artist'
import { LayoutEvent } from '../../system/events'

interface State {
  columns: number
  imageSize: {
    width: number
    height: number
  }
}

class RelatedArtists extends React.Component<ViewProperties, State> {
  constructor(props) {
    super(props)
    this.state = {
        columns: 0,
        imageSize: {
          width: 1,
          height: 1,
        },
    }
  }

  layoutState(currentLayout) : Object {
    const width = currentLayout.width
    const isPad = width > 600
    const isPadHorizontal = width > 900

    const columnCount = isPad ? (isPadHorizontal ? 4 : 3) : 2
    const marginWidth = 20
    const totalMargins = marginWidth * (columnCount - 1)

    const imageWidth = (width - totalMargins) / columnCount
    const imageHeight = imageWidth / 1.5

    return {
      columns: columnCount,
      imageSize: {
        width: Math.floor(imageWidth),
        height: Math.floor(imageHeight),
      },
    }
  }

  onLayout = (event: LayoutEvent) => {
    const newLayoutState = this.layoutState(event.nativeEvent.layout)
    if (this.state.columns !== newLayoutState.columns) {
      this.setState(newLayoutState)
    }
  }

  render() {
    return (
      <View style={styles.container} onLayout={this.onLayout.bind(this)}>
        <SerifText style={styles.heading}>Related Artists</SerifText>
        <View style={styles.artistContainer}>
          { this.renderArtists() }
        </View>
      </View>
    )
  }

  renderArtists() {
    const artists = this.props.artists
    const artistViews = artists.map(artist => {
      return <RelatedArtist key={artist.__id} artist={artist} imageSize={this.state.imageSize} />
    })

    const numberOfTrailingViews = artists.length % this.state.columns
    if (numberOfTrailingViews > 0) {
      const extraRequiredViews = this.state.columns - numberOfTrailingViews
      for (let i = 0; i < extraRequiredViews; i++) {
        artistViews.push(<View key={'related-artist-spacer-' + i} style={this.state.imageSize} />)
      }
    }

    return artistViews
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  artistContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    marginTop: 12,
    marginLeft: -10,
    marginRight: -10,
  },
  heading: {
    fontSize: 20,
  }
})

export default Relay.createContainer(RelatedArtists, {
  fragments: {
    artists: () => Relay.QL`
      fragment on Artist @relay(plural: true) {
        __id
        ${RelatedArtist.getFragment('artist')}
      }
    `
  }
})

interface RelayProps {
  artists: Array<{
    __id: string,
  } | null> | null,
}
