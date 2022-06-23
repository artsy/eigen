import { ArtworkInfoSectionTestsQuery } from "__generated__/ArtworkInfoSectionTestsQuery.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkInfoSectionFragmentContainer } from "./Components/ArtworkInfoSection"

jest.unmock("react-relay")

describe("ArtworkInfoSection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<ArtworkInfoSectionTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtworkInfoSectionTestsQuery @relay_test_operation {
          commerceOrder(id: "some-id") {
            internalID
            ...ArtworkInfoSection_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <ArtworkInfoSectionFragmentContainer artwork={props.commerceOrder} />
        }
        return null
      }}
    />
  )
  it("renders auction result when auction results are available", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    resolveMostRecentRelayOperation(mockEnvironment, {
      CommerceOrder: () => ({
        internalID: "222",
        lineItems: {
          edges: [
            {
              node: {
                artwork: {
                  medium: "Rayon thread on poly twill backed",
                  editionOf: "edit of 30",
                  dimensions: {
                    cm: "10.5 × 7.9 cm",
                    in: "4 1/8 × 3 1/8 in",
                  },
                  artistNames: "Kerry James Marshall",
                  date: "2017",
                  image: {
                    url: "https://homepages.cae.wisc.edu/~ece533/images/airplane.webp",
                  },
                  title: "Set of Six (Six) Scout Series Embroidered Patches",
                },
              },
            },
          ],
        },
      }),
    })

    expect(tree.findByProps({ testID: "date" }).props.children).toBe("2017")
    expect(tree.findByProps({ testID: "medium" }).props.children).toBe(
      "Rayon thread on poly twill backed"
    )

    expect(tree.findByProps({ testID: "title" }).props.children).toBe(
      "Set of Six (Six) Scout Series Embroidered Patches, "
    )
    expect(tree.findByProps({ testID: "image" }).props.source).toStrictEqual({
      uri: "https://homepages.cae.wisc.edu/~ece533/images/airplane.webp",
    })
    expect(tree.findByProps({ testID: "artistNames" }).props.children).toBe("Kerry James Marshall")
    expect(tree.findByProps({ testID: "editionOf" }).props.children).toBe("edit of 30")
  })
})
