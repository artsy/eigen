/* @flow */
'use strict';

import Relay from 'react-relay';

class Artist extends Relay.Route {
  static queries = {
    artist: (component, params) => Relay.QL`
      query {
        artist(id: $artistID) {
          ${component.getFragment('artist', params)}
        }
      }
    `,
  };

  static paramDefinitions = {
    artistID: { required: true },
  };

  static routeName = 'ArtistRoute';
}

class Home extends Relay.Route {
  static queries = {
    home: (component, params) => Relay.QL`
      query {
        home_page_modules {
          ${component.getFragment('home', params)}
        }
      }
    `,
  };

  static routeName = 'HomeRoute';
}

export default {
  Artist,
  Home,
};
