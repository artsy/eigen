import { fireEvent, screen } from "@testing-library/react-native"
import { OrderDetailMetadata } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailMetadata"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("OrderDetailMetadata", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => <OrderDetailMetadata order={props.me.order} />,
    query: graphql`
      query OrderDetailMetadataTestsQuery @relay_test_operation {
        me {
          order(id: "test-order") {
            ...OrderDetailMetadata_order
          }
        }
      }
    `,
  })

  it("renders artwork image and metadata", () => {
    renderWithRelay({
      Order: () => ({
        totalListPrice: { display: "€1,242" },
        lineItems: [
          {
            artwork: {
              partner: {
                name: "Commerce Test Partner",
              },
            },
            artworkVersion: {
              artistNames: "Pablo Picasso",
              title: "Guernica",
              date: "1936",
              attributionClass: { shortDescription: "Unique work" },
              image: { url: "https://example.com/artwork.jpg" },
            },
            artworkOrEditionSet: {
              __typename: "Artwork",
              price: "€1,242",
              dimensions: { in: "24 × 36 in", cm: "61 × 91.4 cm" },
            },
          },
        ],
      }),
    })

    expect(screen.getByRole("image")).toBeOnTheScreen()
    expect(screen.getByText("Pablo Picasso")).toBeOnTheScreen()
    expect(screen.getByText("Guernica")).toBeOnTheScreen()
    expect(screen.getByText(/1936/)).toBeOnTheScreen()
    expect(screen.getByText("Commerce Test Partner")).toBeOnTheScreen()
    expect(screen.getByText("Unique work")).toBeOnTheScreen()
    expect(screen.getByText("List price: €1,242")).toBeOnTheScreen()
    expect(screen.getByText("24 × 36 in | 61 × 91.4 cm")).toBeOnTheScreen()
  })

  it("navigates to the artwork screen", () => {
    renderWithRelay({
      Order: () => ({
        lineItems: [
          {
            artwork: { slug: "artwork-id", published: true },
            artworkVersion: { image: { url: "https://example.com/artwork.jpg" } },
          },
        ],
      }),
    })

    expect(screen.getByRole("image")).toBeOnTheScreen()

    fireEvent.press(screen.getByRole("image"))
    expect(navigate).toBeCalledWith("/artwork/artwork-id")
  })
})
