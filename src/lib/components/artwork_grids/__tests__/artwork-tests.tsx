import 'react-native'

import * as React from 'react'
import * as renderer from 'react-test-renderer'

import Artwork from '../artwork'

// jest.mock('../../opaque_image_view.tsx', () => 'AROpaqueImageView')

it('renders properly', () => {
  const artworkProps = {
    title: 'Some Kind of Dinosaur',
    date: '2015',
    sale_message: '$875',
    is_in_auction: false,
    image: {
      url: 'artsy.net/image-url',
      aspect_ratio: 0.74
    },
    artists: [
      {
        name: 'Mikael Olson'
      }
    ],
    partner: {
      name: 'Gallery 1261'
    },
    href: '/artwork/mikael-olson-some-kind-of-dinosaur'
  }

  const artwork = renderer.create(<Artwork artwork={artworkProps} />).toJSON()
  expect(artwork).toMatchSnapshot()
})
