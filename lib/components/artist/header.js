/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { StyleSheet, View, Text, TouchableHighlight } = React;

import Colors from '../colors';
import InvertedButton from '../buttons/inverted_button';

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
      <View style={styles.box}>
        <Text style={styles.text}>{artist.name}</Text>
        <Text style={styles.text}>{artist.nationality}, b. {artist.birthday}</Text>
        <Text style={[styles.text, { color: Colors.grayDarkerColor }]}>{artist.counts.follows} Followers</Text>
        <InvertedButton text="Follow" onPress={followAction} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'stretch'
  },
  text: {
    textAlign: 'center'
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
