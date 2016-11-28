'use strict'

import React from 'react'
import { storiesOf } from '@kadira/react-native-storybook'
import { RootContainer } from 'react-relay'

import Gene from '../lib/containers/gene'
import Routes from '../lib/relay/routes'

const defaultRefineSettings = {
  medium: '*',
  price_range: '*-*'
}

storiesOf('Gene')
  .add('Contemporary Pop', () => {
    const geneRoute = new Routes.Gene({ geneID: 'contemporary-pop', refineSettings: defaultRefineSettings })
    return <RootContainer Component={Gene} route={geneRoute} />
  })
  .add('Kawaii', () => {
    const geneRoute = new Routes.Gene({ geneID: 'kawaii', refineSettings: defaultRefineSettings })
    return <RootContainer Component={Gene} route={geneRoute} />
  })
  .add('Popular Culture', () => {
    const geneRoute = new Routes.Gene({ geneID: 'popular-culture', refineSettings: defaultRefineSettings })
    return <RootContainer Component={Gene} route={geneRoute} />
  })
  .add('Related to Film', () => {
    const geneRoute = new Routes.Gene({ geneID: 'related-to-film', refineSettings: defaultRefineSettings })
    return <RootContainer Component={Gene} route={geneRoute} />
  })
