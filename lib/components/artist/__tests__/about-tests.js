import 'react-native'

import React from 'react'
import renderer from 'react-test-renderer'

import About from '../about'

jest.mock('../../opaque_image_view.js', () => 'AROpaqueImageView')

it('renders properly', () => {
  const artist = {
    has_metadata: true,
    is_display_auction_link: true,
    articles: [],
    related_artists: []
  }
  const about = renderer.create(<About artist={artist}/>).toJSON()
  expect(about).toMatchSnapshot()
})
