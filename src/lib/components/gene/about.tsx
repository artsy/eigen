import Relay from 'react-relay'
import React from 'react'
import { View, StyleSheet } from 'react-native'

import Biography from './biography'

import RelatedArtists from '../related_artists'
import Separator from '../separator'

class About extends React.Component {
  render() {
    return (
      <View>
        { this.biography() }
        { this.relatedArtists() }
      </View>
    )
  }

  biography() {
    return (
      <View>
        <Biography gene={this.props.gene} style={styles.sectionSeparator} />
        <Separator style={styles.sectionSeparator} />
      </View>
    )
  }

  relatedArtists() {
    return this.props.gene.trending_artists.length ? <RelatedArtists artists={this.props.gene.trending_artists}/> : null
  }
}

const styles = StyleSheet.create({
  sectionSeparator: {
    marginBottom: 20,
  },
})

export default Relay.createContainer(About, {
  fragments: {
    gene: () => Relay.QL`
      fragment on Gene {
        ${Biography.getFragment('gene')}
        trending_artists {
          ${RelatedArtists.getFragment('artists')}
        }
      }
    `,
  }
})

interface IRelayProps {
  gene: {
    trending_artists: Array<boolean | number | string | null> | null,
  },
}
