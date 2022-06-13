import { ArtworkHistory_artwork$data } from "__generated__/ArtworkHistory_artwork.graphql"
import { GlobalStoreProvider } from "app/store/GlobalStore"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Theme } from "palette"
import React from "react"
import { ArtworkHistory } from "./ArtworkHistory"

jest.unmock("react-relay")

describe("Artwork History", () => {
  it("renders everything", () => {
    const artworkHistoryInfo = {
      artwork: {
        provenance: "vegas",
        exhibitionHistory: "this was in shows",
        literature: "bibliography",
      },
    }

    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <div>
            <ArtworkHistory artwork={artworkHistoryInfo.artwork as ArtworkHistory_artwork$data} />
          </div>
        </Theme>
      </GlobalStoreProvider>
    )

    expect(component.text()).toContain("Provenance")
    expect(component.text()).toContain("Exhibition History")
    expect(component.text()).toContain("Bibliography")
  })

  it("renders only set keys", () => {
    const artworkHistoryInfo = {
      artwork: {
        provenance: "vegas",
        exhibitionHistory: null,
        literature: "bibliography",
      },
    }

    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <div>
            <ArtworkHistory artwork={artworkHistoryInfo.artwork as ArtworkHistory_artwork$data} />
          </div>
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.text()).toContain("Provenance")
    expect(component.text()).not.toContain("Exhibition History")
    expect(component.text()).toContain("Bibliography")
  })

  it("doesn't render without data", () => {
    const artworkHistoryInfo = {
      artwork: {
        provenance: null,
        exhibitionHistory: null,
        literature: null,
      },
    }

    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <div>
            <ArtworkHistory artwork={artworkHistoryInfo.artwork as ArtworkHistory_artwork$data} />
          </div>
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.text()).not.toContain("Provenance")
    expect(component.text()).not.toContain("Exhibition History")
    expect(component.text()).not.toContain("Bibliography")
  })
})
