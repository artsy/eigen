/* @flow */
'use strict';

import Relay from 'react-relay';

class Artist extends Relay.Route {
  static queries = {
    artist: () => Relay.QL`
      query { artist(id: $artistID) }
    `,
  };

  static paramDefinitions = {
    artistID: { required: true },
  };

  static routeName = 'ArtistRoute';
}

export default {
  Artist,
};
