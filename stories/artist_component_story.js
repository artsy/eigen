'use strict'

import React from 'react'
import { storiesOf } from '@kadira/react-native-storybook'
import { RootContainer } from 'react-relay'

import Artist from '../lib/containers/artist'
import Routes from '../lib/relay/routes'

storiesOf('Artist')
  .add('Glenn Brown', () => {
    const artistRoute = new Routes.Artist({ artistID: 'glenn-brown' })
    return <RootContainer Component={Artist} route={artistRoute} />
  })
  .add('Leda Catunda', () => {
    const artistRoute = new Routes.Artist({ artistID: 'leda-catunda' })
    return <RootContainer Component={Artist} route={artistRoute} />
  })
  .add('Jorge Vigil', () => {
    const artistRoute = new Routes.Artist({ artistID: 'jorge-vigil' })
    return <RootContainer Component={Artist} route={artistRoute} />
  })
  .add('Rita Maas', () => {
    const artistRoute = new Routes.Artist({ artistID: 'rita-maas' })
    return <RootContainer Component={Artist} route={artistRoute} />
  })
