/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView } from 'react-native';

import ArtworkRail from '../components/home/artwork_rail';
import ArtistRail from '../components/home/artistrails/artistrail';


class Home extends React.Component {
  render() {
    const modules = [];
    const artwork_modules = this.props.home.artwork_modules;
    const artist_modules = this.props.home.artist_modules.concat(); // create a copy
    for (let i = 0; i < artwork_modules.length; i++) {
      const artwork_module = artwork_modules[i];
      modules.push(<ArtworkRail key={artwork_module.__id} rail={artwork_module} />);
      // For now, show an artist rail after each 2 artwork rails, until the artist rails array is depleted.
      if ((i + 1) % 2 === 0) {
        const artist_module = artist_modules.shift();
        if (artist_module) {
          modules.push(<ArtistRail key={artist_module.__id} rail={artist_module} />);
        }
      }
    }
    return (<ScrollView>{modules}</ScrollView>);
  }
}

export default Relay.createContainer(Home, {
  fragments: {
    home: () => Relay.QL`
      fragment on HomePage {
        artwork_modules {
          __id
          ${ArtworkRail.getFragment('rail')}
        }
        artist_modules {
          __id
          ${ArtistRail.getFragment('rail')}
        }
      }
    `,
  }
})