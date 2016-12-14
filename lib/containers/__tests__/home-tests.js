// @flow

'use strict'
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import Home from '../home'

jest.mock('../../components/home/artist_rails/artist_rail', () => 'ArtistRail')
jest.mock('../../components/spinner.js', () => 'ARSpinner')
jest.mock('../../components/opaque_image_view.js', () => 'AROpaqueImageView')

it('renders', () => {
  const home = {
    hero_units: [],
    artist_modules: [],
    artwork_modules: [],
  }
  const homeComponent = renderer.create(<Home home={home}/>).toJSON()
  expect(homeComponent).toMatchSnapshot()
})
