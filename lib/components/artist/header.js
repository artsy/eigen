/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { StyleSheet, View, Text, TouchableHighlight } = React;

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

  render() {
    const followAction = () => { console.log('TODO: Follow') };
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
        <InvertedButton text="Follow" onPress={followAction} />
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
    color: colors['gray-semibold']
  }
});

export default Relay.createContainer(Header, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
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
