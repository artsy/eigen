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
    route: { name: 'string' , params:{}, useMockData: true, queries: {}}
    };
  }

  // TODO: Improve handling state, currently this works only when you full re-render the whole virtual view tree
  // e.g. jumping between two stories of the same component will not trigger state changes. I gave a
  // considerable amount of time, then noticed we _don't_ use too much state inside our components
  // and have made the time tradeoff to say it's not worth it for now.

  // If you are using state in a component, where you would normally set the default, you should check props first
  // e.g. `this.state = this.props.state || { following: false, followersCount: props.artist.counts.follows };`

  constructor(props) {
    super(props);
    this.state = this.props.state;
  }

  // Directly render the child, and add the data
  render() {
    return <this.props.Component {...this.props.props} {...this.props.state} />;
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
