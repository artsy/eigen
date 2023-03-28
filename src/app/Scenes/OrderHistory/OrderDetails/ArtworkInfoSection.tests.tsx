import { ArtworkInfoSectionTestsQuery } from "__generated__/ArtworkInfoSectionTestsQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { ArtworkInfoSectionFragmentContainer } from "./Components/ArtworkInfoSection"

describe("ArtworkInfoSection", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkInfoSectionTestsQuery>({
    Component: (props) => {
      if (props?.commerceOrder) {
        return <ArtworkInfoSectionFragmentContainer artwork={props.commerceOrder} />
      }
      return null
    },
    query: graphql`
      query ArtworkInfoSectionTestsQuery @relay_test_operation {
        commerceOrder(id: "some-id") {
          internalID
          ...ArtworkInfoSection_artwork
        }
      }
    `,
  })

  it("renders auction result when auction results are available", () => {
    const tree = renderWithRelay({
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

    expect(tree.UNSAFE_getByProps({ testID: "date" }).props.children).toBe("2017")
    expect(tree.UNSAFE_getByProps({ testID: "medium" }).props.children).toBe(
      "Rayon thread on poly twill backed"
    )

    expect(tree.UNSAFE_getByProps({ testID: "title" }).props.children).toBe(
      "Set of Six (Six) Scout Series Embroidered Patches, "
    )
    expect(tree.UNSAFE_getByProps({ testID: "image" }).props.source).toStrictEqual({
      uri: "https://homepages.cae.wisc.edu/~ece533/images/airplane.webp",
    })
    expect(tree.UNSAFE_getByProps({ testID: "artistNames" }).props.children).toBe(
      "Kerry James Marshall"
    )
    expect(tree.UNSAFE_getByProps({ testID: "editionOf" }).props.children).toBe("edit of 30")
  })
})
