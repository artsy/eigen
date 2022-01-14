import { AppRegistry, View, Text, Button, Image } from 'react-native'
import React from 'react';
import {NativeModules} from 'react-native'
import { getArtwork } from "./src/lib/utils/appClipFetch"
import { Theme } from './src/palette/Theme';
import { AppClipArtwork } from './src/lib/Scenes/AppClip/Artwork';

const AppClip = () => {
  const {AppClipLinkingManager} = NativeModules
  const [artworkId, setArtworkId] = React.useState('Checking URL')
  const [artwork, setArtwork] = React.useState(null)
  const [clipFormat, setClipFormat] = React.useState('')
  React.useEffect(() => {
    AppClipLinkingManager.getInitialLink()
      .then(url => {
        console.log('URL:', url)
        const splitted = url.split('/')
        const artworkId = splitted[splitted.length - 1]
        console.log('artworkId:', artworkId)
        setArtworkId(artworkId)
        setClipFormat('artwork')
      })
      .catch(e => console.log('index error: ' +e.message))
  }, [])
  React.useEffect(() => {
    getArtwork(artworkId)
      .then(setArtwork)
      .catch(e => console.log('index error: ' +e.message))
  }, [artworkId])

  // const clipFormat = 'artwork'
  // const artworkId = 'talia-ramkilawan-truly-madly-deeply-in-love-with-you'

  const AppProviders = ({ children }) => (
    <Theme>
      {children}
    </Theme>
  )

  return (
    <AppProviders>
      { clipFormat === 'artwork' ?
        <AppClipArtwork artworkId={artworkId} /> :
        <View><Text>{artworkId}</Text></View> }
    </AppProviders>
  )
}

AppRegistry.registerComponent('AppClip', () => AppClip);