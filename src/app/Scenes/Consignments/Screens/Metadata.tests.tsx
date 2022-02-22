import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { ConsignmentMetadata } from "../index"
import Metadata from "./Metadata"

const nav = {} as any

const exampleMetadata: ConsignmentMetadata = {
  title: "My Work",
  year: "1983",
  category: "Architecture",
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
    const tree = renderWithWrappers(<Metadata navigator={nav} metadata={consignmentMetadata} />)
    expect(
      tree.root.findByProps({ testID: "consigments-metatdata-title" }).props.text.value
    ).toBeFalsy()
  })

  it("is set up with filled consignment metadata", () => {
    const tree = renderWithWrappers(<Metadata navigator={nav} metadata={exampleMetadata} />)

    expect(
      tree.root.findByProps({ testID: "consigments-metatdata-title" }).props.text.value
    ).toBeTruthy()
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

      metadata.setState = (partial) => (metadata.state = Object.assign({}, originalState, partial))
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
})
