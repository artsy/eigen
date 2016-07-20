/* @flow */
'use strict';

import React from 'react';

// Emulates a Relay-compatible container, passing the data in directly.
// It's hard to know how well this can work for complicated examples. However,
// it's worked well enough so far - ./

export default class StubbedContainer extends React.Component {
  // Provide a stubbed context for child componentes
  getChildContext() {
    return {
      relay: {
        forceFetch: () => {},
        getFragmentResolver: () => {},
        getStoreData: () => {},
        primeCache: () => {}
      },
    route: { name: 'string' }
    };
  }

  // Directly render the child, and add the data
  render() {
    return <this.props.Component {...this.props.data} />;
  }

  // Needed to pass the isRelayContainer validation step
  getFragmentNames() {}
  getFragment() {}
  hasFragment() {}
  hasVariable() {}
}

// Expose dummy relay and a fake route
StubbedContainer.childContextTypes = {
  relay: React.PropTypes.object,
  route: React.PropTypes.object
};
