// @flow

import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import ArtistCard from '../artist_card'

jest.mock('../../../spinner.js', () => 'ARSpinner')
jest.mock('../../../opaque_image_view.js', () => 'AROpaqueImageView')
jest.mock('../../../switch_view.js', () => 'ARSwitchView')

it('renders correctly', () => {
  const artist = {
    __id: "QXJ0aXN0Omp1YW4tZ3Jpcw==",
    formatted_artworks_count: "14 works, 3 for sale",
    formatted_nationality_and_birthday: "Spanish, 1887–1927",
    href: "/artist/juan-gris",
    id: "juan-gris",
    image: {
      _urlZizbi: "https://d32dm0rphc51dk.cloudfront.net/wGMxL6TvlSORJzEHZsK9JA/large.jpg"
    },
    name: "Juan Gris",
  }
  const tree = renderer.create(<ArtistCard artist={artist} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('hides bio when metadata missing correctly', () => {
  const artist = {
    __id: "QXJ0aXN0Omp1YW4tZ3Jpcw==",
    formatted_artworks_count: "14 works, 3 for sale",
    href: "/artist/juan-gris",
    id: "juan-gris",
    image: {
      _urlZizbi: "https://d32dm0rphc51dk.cloudfront.net/wGMxL6TvlSORJzEHZsK9JA/large.jpg"
    },
    name: "Juan Gris",
  }
  const tree = renderer.create(<ArtistCard artist={artist} />).toJSON()
  expect(tree).toMatchSnapshot()
})