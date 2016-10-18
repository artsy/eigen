'use strict'
// import Gene from '../gene'

  // // Wondering why this file is non-standard with imports?
  // // Well, there is a bug which is fixed in 15.4.0
  // // but that's not out yet, so as we only have one
  // // non-trivial test, I can work around that easily
  // //
  // // @see: https://github.com/facebook/jest/issues/1353#issuecomment-249906262

  // beforeEach(() => jest.resetModules())

// it('is empty when *-*', () => {
//   expect(priceRangeToHumanReadableString('*-*')).toEqual('')
// })

// it('looks right when there is only a min value', () => {
//   expect(priceRangeToHumanReadableString('50.00-*')).toEqual('Above $50')
// })

// it('looks right when there is only a max value', () => {
//   expect(priceRangeToHumanReadableString('*-100.00')).toEqual('Below $100')
// })

// it('looks right when there is a max and mix value', () => {
//   expect(priceRangeToHumanReadableString('100.00-10000.00')).toEqual('$100 - $10,000')
// })

it('is a redundant test', () => {
  expect(1 + 1).toEqual(2)
})
  // it.skip('looks like expected', () => {
  //   const React = require('react')  // eslint-disable-line no-unused-vars
  //   const renderer = require('react-test-renderer')

  //   const props = {
  //       gene: {
  //         id: 'An ID',
  //         _id: 'a UUID',
  //         name: 'Example Gene',
  //         description: "Here's some text",
  //         trending_artists: [
  //           {
  //             id: 'an artist',
  //             name: 'Artist name',
  //             counts: {
  //               for_sale_artworks: 1,
  //               artworks: 2
  //             },
  //             image: {
  //               large_version: ''
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   const tree = renderer.create(
  //     <Gene geneID={props.gene.name} gene={props.gene}/>
  //   ).toJSON()
  //   expect(tree).toMatchSnapshot()
  // })
