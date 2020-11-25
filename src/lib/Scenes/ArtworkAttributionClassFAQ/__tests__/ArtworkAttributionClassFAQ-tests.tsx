// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Button, Sans } from "palette"
import React from "react"
import { Text } from "react-native"
import { ArtworkAttributionClassFAQ } from "../ArtworkAttributionClassFAQ"

import { goBack } from "lib/navigation/navigate"

describe("ArtworkAttributionClassFAQ", () => {
  it("renders FAQ header", () => {
    const component = mount(
      <ArtworkAttributionClassFAQ
        safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }}
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        artworkAttributionClasses={attributionClasses}
      />
    )
    expect(component.find(Sans).at(0).text()).toEqual("Artwork classifications")
  })

  it("renders Ok button", () => {
    const component = mount(
      <ArtworkAttributionClassFAQ
        safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }}
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        artworkAttributionClasses={attributionClasses}
      />
    )
    expect(component.find(Button).find(Text).at(0).text()).toEqual("OK")
  })

  it("renders attribution classes", () => {
    const component = mount(
      <ArtworkAttributionClassFAQ
        safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }}
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        artworkAttributionClasses={attributionClasses}
      />
    )
    expect(component.find(Sans).at(1).text()).toEqual("Unique")
    expect(component.find(Sans).at(2).text()).toEqual("One of a kind piece, created by the artist.")
    expect(component.find(Sans)).toHaveLength(17)
  })

  it("returns to previous page when ok button is clicked", () => {
    const component = mount(
      <ArtworkAttributionClassFAQ
        safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }}
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        artworkAttributionClasses={attributionClasses}
      />
    )
    const okButton = component.find(Button).at(0)
    okButton.props().onPress()
    expect(goBack).toHaveBeenCalled()
  })
})

const attributionClasses = [
  {
    name: "Unique",
    longDescription: "One of a kind piece, created by the artist.",
    " $refType": null,
  },
  {
    name: "Limited edition",
    longDescription:
      "Original works created in multiple with direct involvement of the artist. Generally, less than 150 pieces total.",
    " $refType": null,
  },
  {
    name: "Made-to-order",
    longDescription: "A piece that is made-to-order, taking into account the collector’s preferences.",
    " $refType": null,
  },
  {
    name: "Reproduction",
    longDescription:
      "Reproduction of an original work authorized by artist’s studio or estate. The artist was not directly involved in production.",
    " $refType": null,
  },
  {
    name: "Editioned multiple",
    longDescription:
      "Pieces created in larger limited editions, authorized by the artist’s studio or estate. Not produced with direct involvement of the artist.",
    " $refType": null,
  },
  {
    name: "Non-editioned multiple",
    longDescription:
      "Works made in unlimited or unknown numbers of copies, authorized by the artist’s studio or estate. Not produced with direct involvement of the artist.",
    " $refType": null,
  },
  {
    name: "Ephemera",
    longDescription:
      "Items related to the artist, created or manufactured for a specific, limited use. This includes exhibition materials, memorabilia, autographs, etc.",
    " $refType": null,
  },
]
