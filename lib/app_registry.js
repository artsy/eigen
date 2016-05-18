'use strict';

import React from 'react-native';
import Relay from 'react-relay';

import Containers from './containers';
import Routes from './relay/routes';

class Artist extends React.Component {
  render() {
    const artistRoute = new Routes.Artist({ artistID: this.props.artistID });

    // https://facebook.github.io/relay/docs/guides-root-container.html
    return (<Relay.RootContainer
             Component={Containers.Artist}
             route={artistRoute}
             renderLoading={() => {
               return (<React.ActivityIndicatorIOS
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                        size="large"
                        color="black"
                      />);
             }}
             renderFailure={(error, retry) => {
               return (<Text>Failed to load.</Text>);
             }}
           />);
  }
}

React.AppRegistry.registerComponent('Artist', () => Artist);