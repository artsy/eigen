/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { NativeModules, StyleSheet, View, Text, TouchableHighlight } from 'react-native';
const { ARTemporaryAPIModule } = NativeModules;

import Events from '../../modules/events';

import colors from '../../../data/colors';
import InvertedButton from '../buttons/inverted_button';
import Headline from '../text/headline';
import SerifText from '../text/serif';

class Header extends React.Component {
  static propTypes = {
    artist: React.PropTypes.shape({
      name: React.PropTypes.string,
      nationality: React.PropTypes.string,
      birthday: React.PropTypes.string,
      counts: React.PropTypes.shape({
        follows: React.PropTypes.number,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.handleFollowChange = this.handleFollowChange.bind(this);
    this.state = { following: false, followersCount: props.artist.counts.follows };
  }

  componentDidMount() {
    ARTemporaryAPIModule.followStatusForArtist(this.props.artist._id, (error, following) => {
      this.setState({ following: following });
    });
  }

  handleFollowChange() {
    const newFollowersCount = this.state.following ? (this.state.followersCount - 1) : (this.state.followersCount + 1);
    ARTemporaryAPIModule.setFollowStatus(!this.state.following, this.props.artist._id, (error, following) => {
      if (error) {
        __DEV__ ? console.error(error) : console.log(error);
      } else {
        Events.postEvent(this, {
          name: following ? 'Follow artist' : 'Unfollow artist',
          artist_id: this.props.artist._id,
          artist_slug: this.props.artist.id,
          // TODO At some point, this component might be on other screens.
          source_screen: 'artist page',
        });
      }
      this.setState({ following: following, followersCount: newFollowersCount });
      this.renderFollowersCount();
    });
  }

  render() {
    const artist = this.props.artist;
    return (
      <View style={{paddingTop: 20}}>
        <Headline style={[styles.base, styles.headline]}>
          {artist.name}
        </Headline>
        {this.renderByline()}
        {this.renderFollowersCount()}
        <InvertedButton text={this.state.following ? 'Following' : 'Follow'}
                        selected={this.state.following}
                        onPress={this.handleFollowChange} 
                        style={styles.followButton} />
      </View>
    );
  }

  renderFollowersCount() {
    const count = this.state.followersCount;
    const followerString = count + (count === 1 ? " Follower" : " Followers");
    return (
      <SerifText style={[styles.base, styles.followCount]}>
          {followerString}
      </SerifText>
    );
  }

  renderByline() {
    const artist = this.props.artist;
    const bylineRequired = (artist.nationality || artist.birthday);
    if (bylineRequired) {
      return (
        <View>
            <SerifText style={styles.base}>
                {this.descriptiveString()}
              </SerifText>
        </View>
      );
    } else {
      return null;
    }
  }

  descriptiveString() {
    const artist = this.props.artist;
    const descriptiveString = (artist.nationality || "") + this.birthdayString();
    return descriptiveString;
  }

  birthdayString() {
    const birthday = this.props.artist.birthday;
    if (!birthday) return "";

    const leadingSubstring = this.props.artist.nationality ? ", b." : "";

    if (birthday.includes("born")) {
      return birthday.replace("born", leadingSubstring);
    } else if (birthday.includes("Est.") || birthday.includes("Founded")) {
      return " " + birthday;
    }

    return leadingSubstring + " " + birthday;
  }
}

const styles = StyleSheet.create({
  base: {
    textAlign: 'center',
  },
  headline: {
    fontSize: 14,
  },
  followCount: {
    color: colors['gray-semibold'],
    marginBottom: 30
  },
  followButton: {
    height: 40,
  }
});

export default Relay.createContainer(Header, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        _id
        id
        name
        nationality
        birthday
        counts {
          follows
        }
      }
    `,
  }
});
