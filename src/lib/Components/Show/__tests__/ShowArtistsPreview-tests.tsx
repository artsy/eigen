import { ShowArtistsPreviewTestsQueryRawResponse } from "__generated__/ShowArtistsPreviewTestsQuery.graphql"
import { graphql } from "react-relay"

import { Button } from "@artsy/palette"
import { ShowFixture } from "lib/__fixtures__/ShowFixture"

import { ArtistListItem } from "lib/Components/ArtistListItem"
import { ShowArtistsPreviewContainer as ShowArtistsPreview } from "../ShowArtistsPreview"

jest.unmock("react-relay")
import { renderRelayTree } from "lib/tests/renderRelayTree"
import relay from "react-relay"

const renderTree = () =>
  renderRelayTree({
    Component: ShowArtistsPreview,
    query: graphql`
      query ShowArtistsPreviewTestsQuery @raw_response_type {
        show(id: "anderson-fine-art-gallery-flickinger-collection") {
          ...ShowArtistsPreview_show
        }
      }
    `,
    mockResolvers: {
      Show: () => ({
        ...ShowFixture,
        artists: () => ShowFixture.artists,
      }),
    } as ShowArtistsPreviewTestsQueryRawResponse,
  })

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
