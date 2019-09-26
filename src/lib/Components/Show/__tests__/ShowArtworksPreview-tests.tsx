import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { ShowArtworksPreviewContainer as ShowArtworksPreview } from "../ShowArtworksPreview"

jest.unmock("react-relay")

it("renders properly", async () => {
  const tree = await renderRelayTree({
    Component: (props: any) => <ShowArtworksPreview title="All works" {...props} />,
    query: graphql`
      query ShowArtworksPreviewTestsQuery {
        show(id: "anderson-fine-art-gallery-flickinger-collection") {
          ...ShowArtworksPreview_show
        }
      }
    `,
    mockResolvers: {
      Show: () => ShowFixture,
    },
  })

  expect(tree.html()).toMatchSnapshot()
})
