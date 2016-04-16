/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView } = React;

import Header from '../components/artist/header';

class Component extends React.Component {
  // constructor(arguments) {
  //   super(arguments);
  //
  // }

  render() {
    return (
      <ScrollView>
        <Header artist={this.props.artist} />
      </ScrollView>
    );
  }
}

export default Relay.createContainer(Component, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        ${Header.getFragment('artist')}
      }
    `,
  }
});
