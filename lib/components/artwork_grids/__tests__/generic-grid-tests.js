import 'react-native'

import React from 'react'
import { renderWithLayout } from '../../../tests/render_with_layout'

import GenericArtworksGrid from '../generic_grid'
jest.mock('../../opaque_image_view.js', () => 'AROpaqueImageView')

it('renders properly', () => {
  const artworks = [ artwork(), artwork(), artwork() ]

  const layout = { width: 768 }

  const grid = renderWithLayout(<GenericArtworksGrid artworks={artworks} />, layout)
  expect(grid).toMatchSnapshot()
})

var artwork = () => {
  return {
    __id: Math.random(),
    title: 'DO WOMEN STILL HAVE TO BE NAKED TO GET INTO THE MET. MUSEUM',
    date: '2012',
    sale_message: null,
    is_in_auction: false,
    image: {
      url: 'artsy.net/image-url',
      aspect_ratio: 2.18
    },
    artists: [
      {
        name: 'Guerrilla Girls'
      }
    ],
    partner: {
      name: 'Whitechapel Gallery'
    },
    href: '/artwork/guerrilla-girls-do-women-still-have-to-be-naked-to-get-into-the-met-museum'
  }
}
