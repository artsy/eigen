/* @flow */
'use strict';

import Relay from 'react-relay';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('https://metaphysics-staging.artsy.net')
    // headers: {
    //   Authorization: 'Basic SECRET'
    // })
);
