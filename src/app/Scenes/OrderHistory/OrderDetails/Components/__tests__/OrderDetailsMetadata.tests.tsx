import { fireEvent, screen } from "@testing-library/react-native"
import { OrderDetailsMetadata } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsMetadata"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("OrderDetailsMetadata", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => <OrderDetailsMetadata order={props.me.order} />,
    query: graphql`
      query OrderDetailsMetadataTestsQuery @relay_test_operation {
        me {
          order(id: "test-order") {
            ...OrderDetailsMetadata_order
          }
        }
      }
    `,
  })

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: false })
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

  it("renders single dimension when only inches are provided", () => {
    renderWithRelay({
      Order: () => ({
        lineItems: [
          {
            artwork: {
              partner: { name: "Test Partner" },
            },
            artworkVersion: {
              artistNames: "Test Artist",
              title: "Video Work",
              date: "2023",
            },
            artworkOrEditionSet: {
              __typename: "Artwork",
              price: "€500",
              dimensions: { in: "20 × 30 in", cm: null },
            },
          },
        ],
      }),
    })

    expect(screen.getByText("20 × 30 in")).toBeOnTheScreen()
    expect(screen.queryByText(/\|/)).not.toBeOnTheScreen()
  })

  it("renders single dimension when only cm are provided", () => {
    renderWithRelay({
      Order: () => ({
        lineItems: [
          {
            artwork: {
              partner: { name: "Test Partner" },
            },
            artworkVersion: {
              artistNames: "Test Artist",
              title: "Sculpture Work",
              date: "2023",
            },
            artworkOrEditionSet: {
              __typename: "Artwork",
              price: "€1000",
              dimensions: { in: null, cm: "50 × 30 cm" },
            },
          },
        ],
      }),
    })

    expect(screen.getByText("50 × 30 cm")).toBeOnTheScreen()
    expect(screen.queryByText(/\|/)).not.toBeOnTheScreen()
  })

  it("does not render dimensions when both are null", () => {
    renderWithRelay({
      Order: () => ({
        lineItems: [
          {
            artwork: {
              partner: { name: "Test Partner" },
            },
            artworkVersion: {
              artistNames: "Test Artist",
              title: "Conceptual Work",
              date: "2023",
            },
            artworkOrEditionSet: {
              __typename: "Artwork",
              price: "€750",
              dimensions: { in: null, cm: null },
            },
          },
        ],
      }),
    })

    expect(screen.queryByText(/cm/)).not.toBeOnTheScreen()
    expect(screen.queryByText(/in/)).not.toBeOnTheScreen()
    expect(screen.queryByText(/\|/)).not.toBeOnTheScreen()
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

  describe("with AREnableArtworksFramedSize feature flag enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: true })
    })

    it("prioritizes framed dimensions over regular dimensions", () => {
      renderWithRelay({
        Order: () => ({
          lineItems: [
            {
              artwork: { partner: { name: "Test Partner" } },
              artworkVersion: { artistNames: "Test Artist", title: "Framed Work", date: "2023" },
              artworkOrEditionSet: {
                __typename: "Artwork",
                price: "€1,000",
                dimensions: { in: "20 × 30 in", cm: "50 × 76 cm" },
                framedDimensions: { in: "24 × 34 in", cm: "61 × 86 cm" },
              },
            },
          ],
        }),
      })

      expect(screen.getByText("24 × 34 in | 61 × 86 cm")).toBeOnTheScreen()
      expect(screen.queryByText("20 × 30 in | 50 × 76 cm")).not.toBeOnTheScreen()
    })

    it("falls back to regular dimensions when framed dimensions are not available", () => {
      renderWithRelay({
        Order: () => ({
          lineItems: [
            {
              artwork: { partner: { name: "Test Partner" } },
              artworkVersion: { artistNames: "Test Artist", title: "Unframed Work", date: "2023" },
              artworkOrEditionSet: {
                __typename: "Artwork",
                price: "€800",
                dimensions: { in: "18 × 24 in", cm: "45 × 61 cm" },
                framedDimensions: null,
              },
            },
          ],
        }),
      })

      expect(screen.getByText("18 × 24 in | 45 × 61 cm")).toBeOnTheScreen()
    })

    it("renders single framed dimension when only one unit is provided", () => {
      renderWithRelay({
        Order: () => ({
          lineItems: [
            {
              artwork: { partner: { name: "Test Partner" } },
              artworkVersion: { artistNames: "Test Artist", title: "Framed Work", date: "2023" },
              artworkOrEditionSet: {
                __typename: "Artwork",
                price: "€900",
                dimensions: { in: "18 × 24 in", cm: "45 × 61 cm" },
                framedDimensions: { in: "22 × 28 in", cm: null },
              },
            },
          ],
        }),
      })

      expect(screen.getByText("22 × 28 in")).toBeOnTheScreen()
      expect(screen.queryByText(/\|/)).not.toBeOnTheScreen()
    })
  })
})
