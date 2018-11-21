import React from "react"
import { graphql } from "react-relay"

import { MockRelayRenderer } from "../../../../../tests/MockRelayRenderer"
import { renderUntil } from "../../../../../tests/renderUntil"
import { ShowFixture } from "../../../__fixtures__"

import ListItemButton from "lib/Components/Buttons/InvertedButton"
import { ArtistListItem } from "../Components/ArtistListItem"
import { ArtistsContainer } from "../index"

jest.unmock("react-relay")
import relay from "react-relay"

const renderTree = () =>
  renderUntil(
    wrapper => {
      return wrapper.find(ArtistListItem).length > 0
    },
    <MockRelayRenderer
      Component={ArtistsContainer}
      query={graphql`
        query ArtistsTestsQuery {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            ...Artists_show
          }
        }
      `}
      mockResolvers={{
        Show: () => ({
          ...ShowFixture,
          artists: () => ShowFixture.show.artists,
        }),
      }}
    />
  )

describe("ArtistsContianer", () => {
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
      .find(ListItemButton)
      .first()
      .props()
      .onPress()

    expect(relay.commitMutation).toHaveBeenCalled()
  })

  afterAll(() => {
    ;(relay.commitMutation as any).mockClear()
  })
})
