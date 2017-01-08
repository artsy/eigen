import 'react-native'

import React from 'react'
import renderer from 'react-test-renderer'

import Biography from '../biography'

it('renders properly', () => {
  const artist = {
    bio: 'Born 1922, Germany',
    blurb: 'Once lived in a room with a live coyote for several days to protest the Vietnam War'
  }
  const biography = renderer.create(<Biography artist={artist} />).toJSON()
  expect(biography).toMatchSnapshot()
})
