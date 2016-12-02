import 'react-native'
import React from 'react'
import RelatedArtists from '../'

import renderer from 'react-test-renderer'

jest.mock('../../opaque_image_view.js', () => 'ImageView')

it('lays out correctly', () => {
  const artists = [ {
    __id: 0,
    name: 'Sarah Scott',
    counts: {
      for_sale_artworks: 2,
      artworks: 4,
    },
  }]

  // mock nativeEvent with desired dimensions
  const mockNativeEvent = {
    nativeEvent: {
      layout: {
        width: 768,
      }
    }
  }

  let component = renderer.create(<RelatedArtists artists={artists}/>)
  let tree = component.toJSON()

  // manually trigger onLayout with mocked nativeEvent
  tree.props.onLayout(mockNativeEvent)

  // re-render
  tree = component.toJSON()

  expect(tree).toMatchSnapshot()
})
