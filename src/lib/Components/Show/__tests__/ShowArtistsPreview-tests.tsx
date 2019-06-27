import React from "react"
import { graphql } from "react-relay"

import { Button, Theme } from "@artsy/palette"
import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"

import { ArtistListItem } from "lib/Components/ArtistListItem"
import { ShowArtistsPreviewContainer as ShowArtistsPreview } from "../ShowArtistsPreview"

jest.unmock("react-relay")
import relay from "react-relay"

const renderTree = () =>
  renderUntil(
    wrapper => {
      return wrapper.find(ArtistListItem).length > 0
    },
    <Theme>
      <MockRelayRenderer
        Component={ShowArtistsPreview}
        query={graphql`
          query ShowArtistsPreviewTestsQuery {
            show(id: "anderson-fine-art-gallery-flickinger-collection") {
              ...ShowArtistsPreview_show
            }
          }
        `}
        mockResolvers={{
          Show: () => ({
            ...ShowFixture,
            artists: () => ShowFixture.artists,
          }),
        }}
      />
    </Theme>
  )

describe("ArtistsContainer", () => {
  beforeAll(() => {
    relay.commitMutation = jest.fn()
  })

  it("Renders the show artists", async () => {
    const tree = await renderTree()
    expect(
      tree
        .find(ArtistListItem)
        .first()
        .text()
    ).toContain("Hans Hofmann")
  })

  it("Commits a follow mutation", async () => {
    const tree = await renderTree()

    tree
      .find(Button)
      .first()
      .props()
      .onPress()

    expect(relay.commitMutation).toHaveBeenCalled()
  })

  afterAll(() => {
    ;(relay.commitMutation as any).mockClear()
  })
})
