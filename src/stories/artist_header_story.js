import React from 'react'
import { View } from 'react-native'

import { storiesOf } from '@kadira/react-native-storybook'
import { RootContainer } from 'react-relay'

import ArtistHeader from '../lib/components/artist/header'
import Routes from '../lib/relay/routes'
import StubContainer from 'react-storybooks-relay-container'

storiesOf('Artist Header')
  .addDecorator((story) => (
    <View style={{marginLeft: 20, marginRight: 20}}>{story()}</View>
  ))
  .add('Real Artist - Glenn Brown', () => {
    const artistRoute = new Routes.Artist({ artistID: 'glenn-brown' })
    return <RootContainer Component={ArtistHeader} route={artistRoute} />
  })
  .add('Real Artist - Leda Catunda', () => {
    const artistRoute = new Routes.Artist({ artistID: 'leda-catunda' })
    return <RootContainer Component={ArtistHeader} route={artistRoute}/>
  })
  // Note that for these two, the follow button / count will remain the
  // same as it was from one of the above artists. Once they are in relay/graphQL
  // stubbing that data can be a possiblity
  .add('No Birthday', () => {
    const props = {
      artist: {
        name : 'Example Data',
        nationality: 'UK',
        counts : { follows: 12 }

      }
    }
    return <StubContainer Component={ArtistHeader} props={props}/>
  })
  .add('Full Data', () => {
    let api = {
      artist: {
        name : 'Another Exmaple',
        nationality: 'OK',
        birthday: '1999',
        counts : { follows: 12 }
      }
    }
    return <StubContainer Component={ArtistHeader} props={api}/>
  })

