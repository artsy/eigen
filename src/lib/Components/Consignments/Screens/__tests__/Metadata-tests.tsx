import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { ConsignmentMetadata } from "../../index"
import Metadata from "../Metadata"

import { Theme } from "@artsy/palette"

const nav = {} as any
const route = {} as any

const exampleMetadata: ConsignmentMetadata = {
  title: "My Work",
  year: "1983",
  category: "ARCHITECTURE",
  categoryName: "Architecture",
  medium: "Wood",
  width: "100",
  height: "100",
  depth: null,
  unit: "cm",
  displayString: "5/5",
}

describe("state", () => {
  it("is set up with empty consignment metadata", () => {
    const consignmentMetadata = {} as ConsignmentMetadata
    const tree = renderer
      .create(
        <Theme>
          <Metadata navigator={nav} route={route} metadata={consignmentMetadata} />
        </Theme>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it("is set up with filled consignment metadata", () => {
    const tree = renderer
      .create(
        <Theme>
          <Metadata navigator={nav} route={route} metadata={exampleMetadata} />
        </Theme>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it("sets state correctly at init", () => {
    const m = new Metadata({ metadata: exampleMetadata })
    expect(m.state).toEqual(exampleMetadata)
  })

  describe("State changes", () => {
    let metadata: Metadata
    let originalState: ConsignmentMetadata

    beforeEach(() => {
      metadata = new Metadata({ metadata: exampleMetadata })
      originalState = metadata.state

      metadata.setState = partial => (metadata.state = Object.assign({}, originalState, partial))
    })
    it("updates the year", () => {
      metadata.updateYear("1985")
      expect(metadata.state).toMatchDiffSnapshot(originalState)
    })

    it("updates the medium", () => {
      metadata.updateMedium("Metal")
      expect(originalState).toMatchDiffSnapshot(metadata.state)
    })

    it("updates the category", () => {
      metadata.updateMedium("VIDEO_FILM_ANIMATION")
      expect(originalState).toMatchDiffSnapshot(metadata.state)
    })

    it("updates the title", () => {
      metadata.updateTitle("New Artwork Name")
      expect(originalState).toMatchDiffSnapshot(metadata.state)
    })

    it("updates the size metrics", () => {
      metadata.updateHeight("200")
      metadata.updateWidth("200")
      metadata.updateDepth("200")

      expect(originalState).toMatchDiffSnapshot(metadata.state)
    })
  })

  it("sets the category state to the first when you start selecting if it's null", () => {
    const metadata = new Metadata({ metadata: {} })
    metadata.animateStateChange = partial => (metadata.state = Object.assign({}, {}, partial))
    metadata.showCategorySelection()
    expect(metadata.state).toEqual({ category: "PAINTING", categoryName: "Painting", showPicker: true })
  })

  it("doesn't overwrite the category state when you start selecting a category", () => {
    const originalState = { category: "DESIGN", categoryName: "Design" }
    const metadata = new Metadata({ metadata: originalState })
    metadata.animateStateChange = partial => (metadata.state = Object.assign({}, originalState, partial))
    metadata.showCategorySelection()
    expect(metadata.state).toEqual({ category: "DESIGN", categoryName: "Design", showPicker: true })
  })
})
