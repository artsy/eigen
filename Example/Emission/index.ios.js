/* @flow */
'use strict';

import React from 'react-native';
import Relay from 'react-relay';
import Emission from 'emission';

//
// Config
//

Relay.injectNetworkLayer(
  // new Relay.DefaultNetworkLayer('https://metaphysics-staging.artsy.net')
  new Relay.DefaultNetworkLayer('https://metaphysics-production.artsy.net')
    // headers: {
    //   Authorization: 'Basic SECRET'
    // })
);

// Disable the native polyfill during development, which will make network requests show-up in the Chrome dev-tools.
// Specifically, in our case, we get to see the Relay requests.
//
// It will be `undefined` unless running inside Chrome.
//
// See:
// * https://github.com/facebook/react-native/blob/2d0051f21371e8a51fde836c62a474a941023dd4/Libraries/JavaScriptAppEngine/Initialization/InitializeJavaScriptAppEngine.js#L41-L56
// * https://github.com/facebook/react-native/issues/934
//
if (__DEV__ && global.originalXMLHttpRequest != undefined) {
  global.XMLHttpRequest = global.originalXMLHttpRequest;
}

//
// App
//

let artistRoute = new Emission.Routes.Artist({ artistID: 'banksy' });

class Artist extends React.Component {
  render() {
    // https://facebook.github.io/relay/docs/guides-root-container.html
    return (<Relay.RootContainer
             Component={Emission.Containers.Artist}
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
