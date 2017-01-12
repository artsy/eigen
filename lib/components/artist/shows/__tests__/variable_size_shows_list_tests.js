import 'react-native'

import React from 'react'
import renderer from 'react-test-renderer'

import ShowsList from '../variable_size_shows_list'
jest.mock('../../../opaque_image_view.js', () => 'AROpaqueImageView')

it('renders properly', () => {
  const show1 = showProps()
  var show2 = showProps()
  show2.partner.name = 'A Very Nice Gallery'
  show2.location = 'London'

  const shows = [ show1, show2 ]
  const list = renderer.create(<ShowsList shows={shows} showSize={'medium'} />).toJSON()
  expect(list).toMatchSnapshot()
})

var showProps = () => {
  return {
    __id: Math.random(),
    href: 'artsy.net/show',
    cover_image: {
      url: 'artsy.net/image-url'
    },
    kind: 'solo',
    name: 'Expansive Exhibition',
    exhibition_period: 'Jan 1 - March 1',
    status_update: 'Closing in 2 days',
    status: 'running',
    partner: {
      name: 'Gallery'
    },
    location: {
      city: 'Berlin'
    }
  }
}
