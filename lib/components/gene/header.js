/* @flow */
'use strict'

import React from 'react'
import Relay from 'react-relay'
import { NativeModules, StyleSheet, View } from 'react-native'
const { ARTemporaryAPIModule } = NativeModules

import Events from '../../modules/events'

import colors from '../../../data/colors'
import InvertedButton from '../buttons/inverted_button'
import Headline from '../text/headline'
import SerifText from '../text/serif'

class Header extends React.Component {
  state: {
    following: boolean;
  };

  static propTypes: Object = {
    gene: React.PropTypes.shape({
      name: React.PropTypes.string,
    }),
  };

  constructor(props) {
    super(props)
    this.state = { following: null }
  }

  componentDidMount() {
    // ARTemporaryAPIModule.followStatusForArtist(this.props.artist._id, (error, following) => {
    //   this.setState({ following: following })
    // })
  }

  handleFollowChange = () => {
    // const newFollowersCount: number = this.state.following ? (this.state.followersCount - 1) : (this.state.followersCount + 1)
    // ARTemporaryAPIModule.setFollowStatus(!this.state.following, this.props.artist._id, (error, following) => {
    //   if (error) {
    //     console.error(error)
    //   } else {
    //     Events.postEvent(this, {
    //       name: following ? 'Follow artist' : 'Unfollow artist',
    //       artist_id: this.props.artist._id,
    //       artist_slug: this.props.artist.id,
    //       // TODO At some point, this component might be on other screens.
    //       source_screen: 'artist page',
    //     })
    //   }
    //   this.setState({ following: following, followersCount: newFollowersCount })
    // })
    // this.setState({ following: !this.state.following, followersCount: newFollowersCount })
  }

  render() {
    const gene = this.props.gene
    return (
      <View style={{paddingTop: 20}}>
        <Headline style={[styles.base, styles.headline]}>
          {gene.name}
        </Headline>
        {this.renderFollowButton()}
      </View>
    )
  }

  renderFollowButton() {
    if (this.state.following !== null) {
      return (
        <View style={styles.followButton}>
            <InvertedButton text={this.state.following ? 'Following' : 'Follow'}
                            selected={this.state.following}
                            onPress={this.handleFollowChange} />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  base: {
    textAlign: 'center',
  },
  headline: {
    fontSize: 14,
  },
  followButton: {
    height: 40,
  }
})

export default Relay.createContainer(Header, {
  fragments: {
    gene: () => Relay.QL`
      fragment on Gene {
        _id
        id
        name
      }
    `,
  }
})
