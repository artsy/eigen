/* @flow */
'use strict';

import Relay from 'react-relay';

export const metaphysicsURL = 'https://metaphysics-staging.artsy.net';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(metaphysicsURL)
    // headers: {
    //   Authorization: 'Basic SECRET'
    // })
);
