/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView } = React;

import Header from '../components/artist/header';
import Biography from '../components/artist/biography';

class Artist extends React.Component {
  // constructor(arguments) {
  //   super(arguments);
  //
  // }

  render() {
    return (
      <ScrollView>
        <Header artist={this.props.artist} />
        <Biography artist={this.props.artist} />
      </ScrollView>
    );
  }
}

export default Relay.createContainer(Artist, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        ${Header.getFragment('artist')}
        ${Biography.getFragment('artist')}
      }
    `,
  }
});
