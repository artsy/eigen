/* @flow */
'use strict';

// TODOs:
// * Make follow action work
// * Fix label that includes birthday is it’s unknown, e.g. banksy

import Relay from 'react-relay';
import React from 'react-native';
const { StyleSheet, View, Text, TouchableHighlight } = React;
const { ARTemporaryAPIModule } = React.NativeModules;

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
    this.state = { following: false };
  }

  componentDidMount() {
    ARTemporaryAPIModule.followStatusForArtist(this.props.artist._id, (error, following) => {
      this.setState({ following: following });
    });
  }

  handleFollowChange() {
    const following = !this.state.following;
    ARTemporaryAPIModule.setFollowStatus(following, this.props.artist._id, (error, _) => {
      if (error) {
        this.setState({ following: !following });
      }
    });
    // Let’s be optimistic and assume the request will succeed.
    this.setState({ following: following });
  }

  render() {
    const artist = this.props.artist;
    return (
      <View>
        <Headline style={[styles.base, styles.headline]}>
          {artist.name}
        </Headline>
        <SerifText style={styles.base}>
          {artist.nationality}, b. {artist.birthday}
        </SerifText>
        <SerifText style={[styles.base, styles.followCount]}>
          {artist.counts.follows} Followers
        </SerifText>
        <InvertedButton text="Follow" selected={this.state.following} onPress={this.handleFollowChange} />
      </View>
    );
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
  }
});

export default Relay.createContainer(Header, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        _id
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
