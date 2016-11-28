import 'react-native'
import React from 'react'
import About from '../about'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

jest.mock('../../opaque_image_view.js', () => 'ImageView')

it('renders correctly', () => {
  const gene = {
    description: 'This is some example text',
    trending_artists : []
  }
  const about = renderer.create(<About gene={gene}/>).toJSON()
  expect(about).toMatchSnapshot()
})

it('shows trending artists correctly', () => {
  const gene = {
    description: 'This is some example text',
    trending_artists : [{
      _id: '1',
      href: '/thing/artist/url',
      name: 'Artist Name',
      counts: {
        for_sale_artworks: 6,
        artworks: 6
      },
      image: {
        url: ''
      }
    }]
  }
  const about = renderer.create(<About gene={gene}/>).toJSON()
  expect(about).toMatchSnapshot()
})
