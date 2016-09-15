/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import metaphysics from '../../../metaphysics'

import Spinner from '../../spinner'
import SectionTitle from '../section_title'
import ArtistCard from './artist_card'
import Separator from '../../separator'

class ArtistRail extends React.Component {
  state: {
    artists: [Object],
  }

  constructor(props) {
    super(props)
    this.state = {
      artists: []
    }
  }

  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rail.results) {
      this.setState({ artists: nextProps.rail.results.slice(0) })
    }
  }

  /**
   * Removes the followed artist from the list and re-renders.
   */
  handleFollowChange(artist) {
    const artists = this.state.artists.slice(0)
    const index = artists.indexOf(artist)

    metaphysics(suggestedArtistQuery(artist._id))
      .then(({ me: { suggested_artists }}) => {
        if (suggested_artists.length > 0) {
          // Replace the followed artist with the suggested one.
          const suggestedArtist = suggested_artists[0]
          console.log(suggestedArtist)
          artists[index] = suggestedArtist
        } else {
          // In case of no suggestions, just remove the card
          artists.splice(index, 1)
        }
        this.setState({ artists })
      })
      .catch(error => {
        __DEV__ ? console.error(error) : console.log(error)
        // In case of an error, just remove the card.
        artists.splice(index, 1)
        this.setState({ artists })
      })

    // Disable card.
    artist._replacing = true
    this.setState({ artists })
  }

  renderModuleResults() {
    if (this.state.artists.length > 0) {
      return this.state.artists.map(artist => {
        // Compose key, because an artist may appear twice on the home view in different modules.
        const key = this.props.rail.__id + artist.__id
        return <ArtistCard key={key} artist={artist} onFollow={() => this.handleFollowChange(artist)} />
      })
    } else {
      return <Spinner style={{ flex: 1 }} />
    }
  }

  title() {
    switch (this.props.rail.key) {
      case 'TRENDING':
        return 'Artists to Follow: Trending'
      case 'SUGGESTED':
        return 'Artists to Follow: Recommended for You'
      case 'POPULAR':
        return 'Artists to Follow: Popular'
    }
  }

  render() {
    return (
      <View>
        <View style={styles.title}><SectionTitle>{ this.title() }</SectionTitle></View>
        <ScrollView style={styles.cardContainer}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollsToTop={false}>
          {this.renderModuleResults()}
        </ScrollView>
      <Separator style={{marginTop: 5}}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    minHeight: 330,
    marginRight: 15,
  },
  title: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 10
  }
})

export default Relay.createContainer(ArtistRail, {
  initialVariables: {
    fetchContent: false,
  },

  fragments: {
    rail: () => Relay.QL`
      fragment on HomePageArtistModule {
        __id
        key
        results @include(if: $fetchContent) {
          _id
          __id
          ${ArtistCard.getFragment('artist')}
        }
      }
    `,
  }
})

function suggestedArtistQuery(artist_id: string): string {
  return `
    query {
      me {
        suggested_artists(artist_id: "${artist_id}",
                          size: 1,
                          exclude_followed_artists: true,
                          exclude_artists_without_forsale_artworks: true) {
          _id
          __id
          ${ArtistCard.artistQuery}
        }
      }
    }
  `
}
