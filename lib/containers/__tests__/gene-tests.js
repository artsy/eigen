// @flow

'use strict'
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

// Stub out these views for simplicities sake
jest.mock('../../components/gene/header', () => 'Header')
jest.mock('../../components/gene/artworks', () => 'Artworks')

// Native view the Gene references
jest.mock('../../components/opaque_image_view', () => 'ImageView')
jest.mock('../../components/spinner', () => 'Spinner')
jest.mock('../../components/switch_view', () => 'Spinner')

import Gene from '../gene'

describe('handling price ranges', () => {
  it('is empty when *-*', () => {
    const gene = new Gene()
    expect(gene.priceRangeToHumanReadableString('*-*')).toEqual('')
  })

  it('looks right when there is only a min value', () => {
    const gene = new Gene()
    expect(gene.priceRangeToHumanReadableString('50.00-*')).toEqual('Above $50')
  })

  it('looks right when there is only a max value', () => {
    const gene = new Gene()
    expect(gene.priceRangeToHumanReadableString('*-100.00')).toEqual('Below $100')
  })

  it('looks right when there is a max and mix value', () => {
    const gene = new Gene()
    expect(gene.priceRangeToHumanReadableString('100.00-10000.00')).toEqual('$100 - $10,000')
  })
})

it('looks like expected', () => {
  const props = {
      gene: {
        id: 'An ID',
        _id: 'a UUID',
        name: 'Example Gene',
        description: "Here's some text",
        filtered_artworks: {
            total: 12,
            aggregations: [{
              slice: '1212',
              counts: {
                id: 'OK',
                name: 'Sure',
                count: 'Yep'
              }
            }]
        },
        trending_artists: [
          {
            id: 'an artist',
            name: 'Artist name',
            counts: {
              for_sale_artworks: 1,
              artworks: 2
            },
            image: {
              large_version: ''
            }
          }
        ]
      }
    }
  const tree = renderer.create(
    <Gene geneID={props.gene.name} gene={props.gene}/>
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
