import { screen } from "@testing-library/react-native"
import { ArtworkInfoSectionTestsQuery } from "__generated__/ArtworkInfoSectionTestsQuery.graphql"
import { ArtworkInfoSectionFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/ArtworkInfoSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkInfoSection", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkInfoSectionTestsQuery>({
    Component: (props) => <ArtworkInfoSectionFragmentContainer artwork={props.commerceOrder!} />,
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
    renderWithRelay({
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

    expect(screen.getByText("2017")).toBeOnTheScreen()
    expect(screen.getByText("Rayon thread on poly twill backed")).toBeOnTheScreen()

    expect(
      screen.getByText("Set of Six (Six) Scout Series Embroidered Patches, ")
    ).toBeOnTheScreen()
    expect(screen.getByText("Kerry James Marshall")).toBeOnTheScreen()
    expect(screen.getByText("edit of 30")).toBeOnTheScreen()

    expect(screen.getByTestId("image")).toBeOnTheScreen()
  })
})
