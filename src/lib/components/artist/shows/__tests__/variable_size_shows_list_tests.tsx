import 'react-native'
import * as React from 'react'
import * as renderer from 'react-test-renderer'
import mockedModule from '../../../../tests/mocked_module'

// mockedModule('../../../opaque_image_view.tsx', 'AROpaqueImageView')

import ShowsList from '../variable_size_shows_list'

it('renders properly', () => {
  const show1 = showProps()
  var show2 = showProps()
  show2.partner.name = 'A Very Nice Gallery'
  show2.location.city = 'London'

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
