import 'react-native'

import React from 'react'
import renderer from 'react-test-renderer'

import Artworks from '../artworks'
jest.mock('../../artwork_grids/infinite_scroll_grid.js', () => 'ArtworksGrid')

it('renders properly', () => {
  const artist = {
    counts: {
      artworks: 5,
      for_sale_artworks: 2,
    },
  }
  const artworks = renderer.create(<Artworks artist={artist} />).toJSON()
  expect(artworks).toMatchSnapshot()
})
