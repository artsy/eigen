// @flow

'use strict'
import { ListViewDataSource } from 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import Home from '../home'

jest.mock('../../components/home/artist_rails/artist_rail', () => 'ArtistRail')
jest.mock('../../components/spinner.js', () => 'ARSpinner')
jest.mock('../../components/opaque_image_view.js', () => 'AROpaqueImageView')

it('renders', () => {
  const home = {
    hero_units: [],
    artist_modules: [],
    artwork_modules: [],
  }
  const homeComponent = renderer.create(<Home home={home}/>).toJSON()
  expect(homeComponent).toMatchSnapshot()
})

describe('upon initialization', () => {
  it('starts with isRefreshing set to false', () => {
    const homeComponent = new Home(homeProps())
    expect(homeComponent.state.isRefreshing).toBeFalsy()
  })

  it('creates a data source with a search bar and hero unit', () => {
    const homeComponent = new Home(homeProps())
    const dataSourceBlob = extractListViewDataBlob(homeComponent)
    const searchBar = { type: 'search_bar', data: null }
    const heroUnits = { type: 'hero_units', data: [] }
    expect(dataSourceBlob).toContainEqual(searchBar)
    expect(dataSourceBlob).toContainEqual(heroUnits)
  })

  it('always places the first artwork module after search and hero units', () => {
    const homeComponent = new Home(homeProps(1, 1, 1))
    const dataSourceBlob = extractListViewDataBlob(homeComponent)
    expect(dataSourceBlob[2].type).toBe('artwork')
  })
})

var homeProps = (nHeroUnits?: number, nArtistModules?: number, nArtworkModules?: number) => {
  return {
      home: {
        hero_units: modulesOfType('hero_units', nHeroUnits),
        artist_modules: modulesOfType('artist', nArtistModules),
        artwork_modules: modulesOfType('artwork', nArtworkModules),
        }
    }
}

var modulesOfType = (type: string, count: number) => {
  const modules = []
  for (let i = 0; i < count; i++) {
    modules.push({ title: 'Title', type: type })
  }
  return modules
}

var extractListViewDataBlob = (home: Home) => {
  return home.state.dataSource._dataBlob.s1
}
