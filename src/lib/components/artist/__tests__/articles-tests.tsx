import 'react-native'

import * as React from 'react'
import * as renderer from 'react-test-renderer'

import Articles from '../articles'

// jest.mock('../../opaque_image_view.tsx', () => 'AROpaqueImageView')

it('renders properly', () => {
  const articles = [ article(), article() ]
  const articlesComponent = renderer.create(<Articles articles={articles} />).toJSON()
  expect(articlesComponent).toMatchSnapshot()
})

var article = () => {
  return {
    __id: Math.random(),
    thumbnail_title: 'Something Happened',
      href: 'artsy.net/something-happened',
      author: {
        name: 'John Berger',
      },
      thumbnail_image: {
        url: 'artsy.net/image-url'
      },
  }
}
