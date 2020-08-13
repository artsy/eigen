import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import Artist from "../ConsignmentsArtist"
import Edition from "../Edition"
import Location from "../Location"
import Metadata from "../Metadata"
import Overview from "../Overview"

import Provenance from "../Provenance"

jest.mock("@react-native-community/cameraroll", () => jest.fn())

import SelectFromPhotoLibrary from "../SelectFromPhotoLibrary"

const nav = {} as any
const route = {} as any

const anything = expect.anything

it("renders without throwing an error", () => {
  renderWithWrappers(<Overview navigator={nav} route={route} setup={{}} />)
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

  it("pushes a Edition when you tap on Edition", () => {
    overview.goToEditionTapped()
    expect(navigator.push).toBeCalledWith({ component: Edition, passProps: anything() })
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
  const navigator: any = { push: jest.fn() }
  let overview: Overview
  let stateMock: jest.Mock<any>
  let update: any

  beforeEach(() => {
    overview = new Overview({ navigator, route, setup: {} })
    update = overview.updateLocalStateAndMetaphysics
    overview.setState = jest.fn()
    stateMock = overview.setState as any
  })

  it("updates Location", () => {
    overview.updateLocation("Huddersfield", "Yorkshire", "UK")
    expect(stateMock).toBeCalledWith({ location: { city: "Huddersfield", country: "UK", state: "Yorkshire" } }, update)
  })

  it("updates Artist", () => {
    overview.updateArtist({ internalID: "banksy", name: "Banksy" })
    expect(stateMock).toBeCalledWith({ artist: { internalID: "banksy", name: "Banksy" } }, update)
  })

  it("updates work metadata", () => {
    overview.updateMetadata({
      title: "OK",
      year: "1983",
      category: "PAINTING",
      categoryName: "Painting",
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
          category: "PAINTING",
          categoryName: "Painting",
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
})

describe("required data", () => {
  const requiredState: any = {
    artist: {},
    location: {},
    editionScreenViewed: true,
    metadata: {
      category: "a",
      categoryName: "A",
      title: "Work",
      year: "123",
      medium: "123",
      width: "123",
      height: "12",
      depth: 12,
      unit: "CM",
      displayString: "A work",
    },
    photos: [
      {
        file: "some-image-file",
        uploaded: true,
      },
    ],
  }

  it("allows submission when all data is provided", () => {
    const setup = { ...requiredState }
    const overview = new Overview({ setup })
    expect(overview.canSubmit()).toBeTruthy()
  })

  it("does not allow submission without artist", () => {
    const setup = {
      ...requiredState,
      artist: undefined,
    }

    const overview = new Overview({ setup })
    expect(overview.canSubmit()).toBeFalsy()
  })

  it("does not allow submission without location", () => {
    const setup = {
      ...requiredState,
      location: undefined,
    }

    const overview = new Overview({ setup })
    expect(overview.canSubmit()).toBeFalsy()
  })

  it("does not allow submission without editionScreenViewed", () => {
    const setup = {
      ...requiredState,
      editionScreenViewed: false,
    }

    const overview = new Overview({ setup })
    expect(overview.canSubmit()).toBeFalsy()
  })

  it("does not allow submission without metadata", () => {
    const setup = {
      ...requiredState,
      metadata: undefined,
    }

    const overview = new Overview({ setup })
    expect(overview.canSubmit()).toBeFalsy()
  })

  it("does not allow submission without any photos", () => {
    const setup = {
      ...requiredState,
      photos: [],
    }

    const overview = new Overview({ setup })
    expect(overview.canSubmit()).toBeFalsy()
  })
})
