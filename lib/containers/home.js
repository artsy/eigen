/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView } from 'react-native';

import Rail from '../components/home/rail';

class Home extends React.Component {
  render() {
    return (
      <ScrollView>
        {this.props.home.artwork_modules.map(rail => <Rail key={rail.__id} rail={rail} />)}
      </ScrollView>
    );
  }
}

export default Relay.createContainer(Home, {
  fragments: {
    home: () => Relay.QL`
      fragment on HomePage {
        artwork_modules {
          __id
          ${Rail.getFragment('rail')}
        }
      }
    `,
  }
})