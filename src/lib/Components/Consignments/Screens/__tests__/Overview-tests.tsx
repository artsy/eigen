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

const anything = expect.anything

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
    expect(navigator.push).toBeCalledWith({ component: Location, passProps: anything() })
  })

  it("pushes a Artist when you tap on Artist", () => {
    overview.goToArtistTapped()
    expect(navigator.push).toBeCalledWith({ component: Artist, passProps: anything() })
  })

  it("pushes a Metadata when you tap on Metadata", () => {
    overview.goToMetadataTapped()
    expect(navigator.push).toBeCalledWith({ component: Metadata, passProps: anything() })
  })

  it("pushes a Provenance when you tap on Provenance", () => {
    overview.goToProvenanceTapped()
    expect(navigator.push).toBeCalledWith({ component: Provenance, passProps: anything() })
  })

  it("pushes a SelectFromPhotoLibrary when you tap on Photos", () => {
    overview.goToPhotosTapped()
    expect(navigator.push).toBeCalledWith({ component: SelectFromPhotoLibrary, passProps: anything() })
  })
})

describe("Updating State", () => {
  let overview: Overview
  let stateMock: jest.Mock<any>
  let update: any

  beforeEach(() => {
    overview = new Overview({ navigator, route, setup: {} })
    update = overview.updateMetaphysics
    overview.setState = jest.fn()
    stateMock = overview.setState as any
  })

  it("updates Location", () => {
    overview.updateLocation("Huddersfield", "Yorkshire", "UK")
    expect(stateMock).toBeCalledWith({ location: { city: "Huddersfield", country: "UK", state: "Yorkshire" } }, update)
  })

  it("updates Artist", () => {
    overview.updateArtist({ id: "banksy", name: "Banksy" })
    expect(stateMock).toBeCalledWith({ artist: { id: "banksy", name: "Banksy" } }, update)
  })

  it("updates work metadata", () => {
    overview.updateMetadata({
      title: "OK",
      year: "1983",
      category: "Painting",
      medium: "Oil on Canvas",
      width: "100",
      height: "200",
      depth: 20,
      unit: "cm",
      displayString: "Paint on canvas",
    })

    expect(stateMock).toBeCalledWith(
      {
        metadata: {
          category: "Painting",
          depth: 20,
          displayString: "Paint on canvas",
          height: "200",
          medium: "Oil on Canvas",
          title: "OK",
          unit: "cm",
          width: "100",
          year: "1983",
        },
      },
      update
    )
  })

  it("updates Provenance", () => {
    overview.updateProvenance("This is my provenance")
    expect(stateMock).toBeCalledWith({ provenance: "This is my provenance" }, update)
  })

  it.skip("updates Photos")
})
