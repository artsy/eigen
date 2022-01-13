import { AppRegistry, View, Text, Button } from 'react-native'
import React from 'react';
import {NativeModules} from 'react-native'

const AppClip = () => {
  const {AppClipLinkingManager} = NativeModules
  const [url, setUrl] = React.useState('Checking URL')
  React.useEffect(() => {
    AppClipLinkingManager.getInitialLink()
      .then(setUrl)
      .catch(e => setUrl(e.message))
  }, [])
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22 }}>
          Artsy App Clip
      </Text>
      <Text style={{ fontSize: 20 }}>
          {url}
      </Text>
    </View>
  )
}

AppRegistry.registerComponent('AppClip', () => AppClip);