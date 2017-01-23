import 'react-native'

import React from 'react'
import renderer from 'react-test-renderer'

import Artworks from '../artworks'

// Ideally this should not be mocked, but the metaphysics mock doesn't propagate to it and it won't render otherwise
jest.mock('../../artwork_grids/infinite_scroll_grid.js', () => 'ArtworksGrid')

it('renders properly', () => {
  const props = {
    gene: {
      id: 'deep-time',
    },
    medium: 'painting',
    queryState: null,
    queryForPage: null
  }
  const artworks = renderer.create(<Artworks gene={props}/>).toJSON()
  expect(artworks).toMatchSnapshot()
})
