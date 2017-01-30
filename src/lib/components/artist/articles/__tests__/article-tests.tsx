import 'react-native'

import React from 'react'
import renderer from 'react-test-renderer'

import Article from '../article'

jest.mock('../../../opaque_image_view.js', () => 'AROpaqueImageView')

it('renders properly', () => {
  const article = {
    thumbnail_title: 'Something Happened',
      href: 'artsy.net/something-happened',
      author: {
        name: 'John Berger',
      },
      thumbnail_image: {
        url: 'artsy.net/image-url'
      },
  }
  const articleComponent = renderer.create(<Article article={article} />).toJSON()
  expect(articleComponent).toMatchSnapshot()
})
