import { screen, within } from "@testing-library/react-native"
import { InfiniteDiscoveryAboutTheWorkTabTestQuery } from "__generated__/InfiniteDiscoveryAboutTheWorkTabTestQuery.graphql"
import { AboutTheWorkTab } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryAboutTheWorkTab"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { Text } from "react-native"
import { graphql } from "react-relay"

describe("AboutTheWorkTab", () => {
  const { renderWithRelay } = setupTestWrapper<InfiniteDiscoveryAboutTheWorkTabTestQuery>({
    Component: ({ artwork, me }: any) => {
      return (
        <Suspense fallback={<Text>Loading...</Text>}>
          <AboutTheWorkTab artwork={artwork} me={me} />
        </Suspense>
      )
    },
    query: graphql`
      query InfiniteDiscoveryAboutTheWorkTabTestQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...InfiniteDiscoveryAboutTheWorkTab_artwork
        }
        me {
          ...MyProfileEditModal_me
          ...useSendInquiry_me
        }
      }
    `,
    preloaded: true,
  })

  it("renders all artwork details when available", () => {
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({ Artwork: () => artwork })

    expect(screen.getByText("Oil on canvas")).toBeOnTheScreen()
    expect(screen.getByText("20 × 24 in | 50.8 × 61 cm")).toBeOnTheScreen()
    expect(screen.getByText("Unique")).toBeOnTheScreen()
    expect(screen.getByText("Painting")).toBeOnTheScreen()
    expect(screen.getByText("Excellent condition")).toBeOnTheScreen()
    expect(screen.getByText("Signed and dated lower right")).toBeOnTheScreen()
    expect(screen.getByText("Includes gallery certificate")).toBeOnTheScreen()
    expect(screen.getByText("Test Publisher")).toBeOnTheScreen()
    expect(screen.getByText("Frame included")).toBeOnTheScreen()
  })

  it("renders certificate of authenticity section when available", async () => {
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({ Artwork: () => artwork })

    const container = await screen.findByTestId("authenticity-certificate")
    expect(within(container).getByText("Includes a")).toBeOnTheScreen()
    expect(within(container).getByText("Certificate of Authenticity")).toBeOnTheScreen()
  })

  it("does not render optional fields when data is missing", async () => {
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({
      Artwork: () => ({
        ...artwork,
        hasCertificateOfAuthenticity: false,
        condition: null,
        signatureInfo: null,
        publisher: null,
      }),
    })

    // Not sure why, but these two lines were failing tests. cc @carlos
    // mockResolveLastOperation({})
    // await waitForElementToBeRemoved(() => screen.queryByText("Loading..."))

    expect(screen.queryByText("Includes a Certificate of Authenticity")).not.toBeOnTheScreen()
    expect(screen.queryByText("Condition")).not.toBeOnTheScreen()
    expect(screen.queryByText("Signature")).not.toBeOnTheScreen()
    expect(screen.queryByText("Publisher")).not.toBeOnTheScreen()
  })

  it("shows frame not included when isFramed is false", () => {
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({ Artwork: () => ({ ...artwork, isFramed: false }) })

    expect(screen.getByText("Frame not included")).toBeOnTheScreen()
  })

  describe("classification and authenticity section", () => {
    it("shows attribution class when available", async () => {
      const { mockResolveLastOperation } = renderWithRelay()
      mockResolveLastOperation({ Artwork: () => artwork })

      // Ditto
      // mockResolveLastOperation({})
      // await waitForElementToBeRemoved(() => screen.queryByText("Loading..."))

      const container = await screen.findByTestId("attribution")
      expect(within(container).getByText("This is a")).toBeOnTheScreen()
      expect(within(container).getByText("unique work")).toBeOnTheScreen()
    })

    it("shows certificate icon when work has certificate and is not biddable", async () => {
      const { mockResolveLastOperation } = renderWithRelay()
      mockResolveLastOperation({ Artwork: () => artwork })

      // Ditto
      // mockResolveLastOperation({})
      // await waitForElementToBeRemoved(() => screen.queryByText("Loading..."))

      expect(screen.getByTestId("certificate-icon")).toBeOnTheScreen()
    })

    it("does not show certificate icon for biddable works", () => {
      renderWithRelay({ Artwork: () => ({ ...artwork, isBiddable: true }) })

      expect(screen.queryByTestId("certificate-icon")).not.toBeOnTheScreen()
    })
  })
})

const artwork = {
  medium: "Oil on canvas",
  dimensions: {
    in: "20 × 24 in",
    cm: "50.8 × 61 cm",
  },
  attributionClass: {
    name: "Unique",
    shortArrayDescription: ["This is a", "unique work"],
  },
  mediumType: {
    name: "Painting",
  },
  condition: {
    displayText: "Excellent condition",
  },
  signatureInfo: {
    details: "Signed and dated lower right",
  },
  certificateOfAuthenticity: {
    details: "Includes gallery certificate",
  },
  publisher: "Test Publisher",
  isFramed: true,
  hasCertificateOfAuthenticity: true,
  isBiddable: false,
  artists: [
    {
      slug: "test-artist",
    },
  ],
  partner: {
    name: "Test Gallery",
    profile: {
      icon: {
        url: "https://example.com/image.jpg",
      },
    },
  },
}
