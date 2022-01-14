import { AppRegistry, View, Text, Button, Image } from 'react-native'
import React from 'react';
import {NativeModules} from 'react-native'
import { getArtwork } from "./src/lib/utils/appClipFetch"
import { Theme } from './src/palette/Theme';
import { AppClipArtwork } from './src/lib/Scenes/AppClip/Artwork';

const AppClip = () => {
  const {AppClipLinkingManager} = NativeModules
  const [url, setUrl] = React.useState('Checking URL')
  const [artwork, setArtwork] = React.useState(null)
  React.useEffect(() => {
    AppClipLinkingManager.getInitialLink()
      .then(setUrl)
      .catch(e => setUrl(e.message))
  }, [])
  React.useEffect(() => {
    getArtwork('talia-ramkilawan-truly-madly-deeply-in-love-with-you')
      .then(setArtwork)
      .catch(e => setUrl(e.message))
  }, [url])

  const clipFormat = 'artwork'
  const artworkId = 'talia-ramkilawan-truly-madly-deeply-in-love-with-you'

  console.log(artwork?.images)

  const AppProviders = ({ children }) => (
    <Theme>
      {children}
    </Theme>
  )

  return (
    <AppProviders>
      { clipFormat === 'artwork' ?
        <AppClipArtwork artworkId={artworkId} /> :
        <View/>}
    </AppProviders>
  )
}

AppRegistry.registerComponent('AppClip', () => AppClip);