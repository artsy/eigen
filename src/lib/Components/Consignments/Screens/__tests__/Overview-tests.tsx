import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Artist from "../Artist"
import Location from "../Location"
import Metadata from "../Metadata"
import Overview from "../Overview"

import Provenance from "../Provenance"
import SelectFromPhotoLibrary from "../SelectFromPhotoLibrary"
import Welcome from "../Welcome"

const nav = {} as any
const route = {} as any

it("Sets up the right view hierarchy", () => {
  const tree = renderer.create(<Overview navigator={nav} route={route} setup={{}} />).toJSON()
  expect(tree).toMatchSnapshot()
})

describe("Opening the right page", () => {
  let navigator = {} as any
  let overview: Overview

  beforeEach(() => {
    navigator = { push: jest.fn() } as any
    overview = new Overview({ navigator, route, setup: {} })
  })

  it("pushes a Location when you tap on Locations", () => {
    overview.goToLocationTapped()
    expect(navigator.push).toBeCalledWith({ component: Location })
  })

  it("pushes a Artist when you tap on Artist", () => {
    overview.goToArtistTapped()
    expect(navigator.push).toBeCalledWith({ component: Artist, passProps: expect.anything() })
  })

  it("pushes a Metadata when you tap on Metadata", () => {
    overview.goToMetadataTapped()
    expect(navigator.push).toBeCalledWith({ component: Metadata, passProps: expect.anything() })
  })

  it("pushes a Provenance when you tap on Provenance", () => {
    overview.goToProvenanceTapped()
    expect(navigator.push).toBeCalledWith({ component: Provenance, passProps: expect.anything() })
  })

  it("pushes a SelectFromPhotoLibrary when you tap on Photos", () => {
    overview.goToPhotosTapped()
    expect(navigator.push).toBeCalledWith({ component: SelectFromPhotoLibrary, passProps: expect.anything() })
  })
})
