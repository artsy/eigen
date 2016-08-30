/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { StyleSheet, Dimensions, View, Text, TouchableWithoutFeedback, NativeModules } from 'react-native'
const { ARTemporaryAPIModule } = NativeModules

import Events from '../../../modules/events'

import SerifText from '../../text/serif'
import colors from '../../../../data/colors'
import Button from '../../buttons/inverted_button'
import SwitchBoard from '../../../modules/switch_board'
import fragments from './relay_fragments'
import SectionTitle from '../section_title'

const isPad = Dimensions.get('window').width > 700

class ArtworkRailHeader extends React.Component {
  state: {
    following: boolean;
  };

  constructor(props) {
    super(props)
    this.state = { following: false }
  }

  componentDidMount() {
    const context = this.props.rail.context
    if (context && context.__typename === 'HomePageModuleContextRelatedArtist') {
      ARTemporaryAPIModule.followStatusForArtist(context.artist.id, (error, following) => {
        this.setState({ following: following })
      })
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handleViewAll}>
        <View style={styles.container}>
          { this.props.rail.context && this.followAnnotation() }
          <SectionTitle>
          { this.props.rail.title }
          </SectionTitle>
          { this.actionButton() }
        </View>
      </TouchableWithoutFeedback>
    )
  }

  followAnnotation() {
    if (this.props.rail.context.__typename === 'HomePageModuleContextRelatedArtist') {
      return <SerifText style={styles.followAnnotation}>{ 'Based on ' + this.props.rail.context.based_on.name }</SerifText>
    }
  }

  hasAdditionalContent() {
    const additionalContentRails = [
      'followed_artists',
      'saved_works',
      'live_auctions',
      'current_fairs',
      'genes',
      'generic_gene']

    const moduleKey = this.props.rail.key
    return additionalContentRails.indexOf(moduleKey) > -1
  }

  actionButton() {
    if (this.hasAdditionalContent()) {
      return <Text style={styles.viewAllButton}> { 'View All'.toUpperCase() } </Text>
    } else if (this.props.rail.key === 'related_artists') {
        return (
                  <View style={styles.followButton}>
                    <Button text={this.state.following ? 'Following' : 'Follow'}
                            selected={this.state.following}
                            onPress={this.handleFollowChange} />
                  </View>
                )
    }
  }

  handleFollowChange = () => {
    const context = this.props.rail.context
    ARTemporaryAPIModule.setFollowStatus(!this.state.following, context.artist.id, (error, following) => {
      if (error) {
        __DEV__ ? console.error(error) : console.log(error)
      } else {
        Events.postEvent(this, {
          name: following ? 'Follow artist' : 'Unfollow artist',
          artist_id: context.artist.id,
          artist_slug: context.artist.id,
          source_screen: 'artist page',
        })
      }
      this.setState({ following: following })
    })
  }

  handleViewAll = () => {
    const key = this.props.rail.key
    const context = this.props.rail.context

    let url = null
    switch (key) {
      case 'followed_artists':
        url = 'me/notifications'
        break
      case 'related_artists':
        url = context && context.artist.href
        break
      case 'saved_works':
        // this is supposed to route to the Favorites vc artworks tab
        url = 'favorites'
        break
      case 'genes':
      case 'generic_gene':
      case 'current_fairs':
      case 'live_auctions':
        url = context && context.href
        break
    }

    if (url) { SwitchBoard.presentNavigationViewController(this, url) }
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 30,
  },
  title: {
    marginTop: 10,
    fontSize: isPad ? 30 : 26,
    alignSelf: 'center',
    textAlign: 'center',
  },
  viewAllButton: {
    fontFamily: 'Avant Garde Gothic ITCW01Dm',
    fontSize: isPad ? 14 : 12,
    color: colors['gray-medium'],
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  followButton: {
    marginTop: 10,
    marginBottom: 0,
    margin: isPad ? 160 : 135,
    height: 30,
  },
  followAnnotation: {
    fontStyle: 'italic',
    alignSelf: 'center',
    fontSize: 16,
  }
})

export default Relay.createContainer(ArtworkRailHeader, {
  fragments: {
    rail: () => Relay.QL`
      fragment on HomePageArtworkModule {
        title
        key
        context {
          __typename
          ${fragments.relatedArtistFragment}
          ${fragments.geneFragment}
          ${fragments.auctionFragment}
          ${fragments.fairFragment}
        }
      }
    `,
  }
})
