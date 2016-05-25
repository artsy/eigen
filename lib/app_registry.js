'use strict';

import React from 'react-native';
import Relay from 'react-relay';

import Spinner from './components/spinner';
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
               return <Spinner style={{ flex: 1 }} />;
             }}
             renderFailure={(error, retry) => {
               return (<Text>Failed to load.</Text>);
             }}
           />);
  }
}

React.AppRegistry.registerComponent('Artist', () => Artist);