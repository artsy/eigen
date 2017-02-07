import 'react-native'

import * as React from 'react'
import * as renderer from 'react-test-renderer'

import Artworks from '../artworks'
jest.mock('../../../metaphysics.ts')
jest.mock('../../artwork_grids/infinite_scroll_grid.tsx', () => 'ArtworksGrid')

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
