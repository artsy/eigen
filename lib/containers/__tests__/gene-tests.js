import 'react-native'
import React from 'react'
import Relay from 'react-relay'
import renderer from 'react-test-renderer'

import Gene from '../gene'

it('looks like expected', () => {
  const props = {
      gene: {
        id: 'An ID',
        _id: 'a UUID',
        name: 'Example Gene'
      }
    }

  const tree = renderer.create(
    <Gene geneID={props.gene.name} gene={props.gene}/>
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
