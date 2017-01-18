// @flow

import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import ArtistCard from '../artist_card'

jest.mock('../../../spinner.js', () => 'ARSpinner')
jest.mock('../../../opaque_image_view.js', () => 'AROpaqueImageView')
jest.mock('../../../switch_view.js', () => 'ARSwitchView')

it('renders correctly', () => {
  const tree = renderer.create(<ArtistCard artist={artistProps().artist} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('only shows name and artwork count when bio is omitted', () => {
  const props = artistProps(false)
  const artistComponent = new ArtistCard(props)
  const metadata = artistComponent.renderMetadata()

  expect(metadata).toHaveLength(2)
  expect(metadata[0].props.children).toEqual(props.artist.name.toUpperCase())
  expect(metadata[1].props.children).toEqual(props.artist.formatted_artworks_count)
})

const artistProps = (hasBio?: boolean = true) => {
  return {
    artist: {
      __id: "QXJ0aXN0Omp1YW4tZ3Jpcw==",
      formatted_artworks_count: "14 works, 3 for sale",
      formatted_nationality_and_birthday: hasBio ? "Spanish, 1887–1927" : "",
      href: "/artist/juan-gris",
      id: "juan-gris",
      image: {
        _urlZizbi: "https://d32dm0rphc51dk.cloudfront.net/wGMxL6TvlSORJzEHZsK9JA/large.jpg"
      },
      name: "Juan Gris"
    }
  }
}