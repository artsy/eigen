import { PartnerCard_artwork$data } from "__generated__/PartnerCard_artwork.graphql"
import { PartnerCardTestsQuery } from "__generated__/PartnerCardTestsQuery.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { PartnerCardFragmentContainer } from "./PartnerCard"

jest.unmock("react-relay")

describe("PartnerCard", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestWrapper = () => {
    return (
      <QueryRenderer<PartnerCardTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query PartnerCardTestsQuery @relay_test_operation @raw_response_type {
            artwork(id: "artworkID") {
              ...PartnerCard_artwork
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.artwork) {
            return <PartnerCardFragmentContainer artwork={props.artwork} />
          }

          return null
        }}
      />
    )
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders partner name correctly", () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => PartnerCardArtwork,
    })

    expect(getByText("Test Gallery")).toBeTruthy()
  })

  it("renders partner image", () => {
    const { getByLabelText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => PartnerCardArtwork,
    })

    expect(getByLabelText("Avatar")).toBeTruthy()
  })

  it("renders partner type", () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => PartnerCardArtwork,
    })

    expect(getByText("Gallery")).toBeTruthy()
  })

  it("renders partner type correctly for institutional sellers", () => {
    const PartnerCardArtworkInstitutionalSeller = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        type: "Institutional Seller",
      },
    }

    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => PartnerCardArtworkInstitutionalSeller,
    })

    expect(getByText("Institution")).toBeTruthy()
  })

  it("doesn't render partner type for partners that aren't institutions or galleries", () => {
    const PartnerCardArtworkOtherType = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        type: "Some Other Partner Type",
      },
    }
    const { queryByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => PartnerCardArtworkOtherType,
    })

    expect(queryByText("At institution")).toBeFalsy()
    expect(queryByText("At gallery")).toBeFalsy()
  })

  it("renders partner initials when no image is present", () => {
    const PartnerCardArtworkWithoutImage = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        profile: null,
      },
    }
    const { getByText, queryByLabelText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => PartnerCardArtworkWithoutImage,
    })

    expect(getByText("TG")).toBeTruthy()
    expect(queryByLabelText("Avatar")).toBeFalsy()
  })

  it("truncates partner locations correctly", () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => PartnerCardArtwork,
    })

    expect(getByText("Miami, New York, +3 more")).toBeTruthy()
  })

  it("does not render when the partner is an auction house", () => {
    const PartnerCardArtworkAuctionHouse: PartnerCard_artwork$data = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        type: "Auction House",
      },
    }
    const { toJSON } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => PartnerCardArtworkAuctionHouse,
    })

    expect(toJSON()).toBeNull()
  })

  it("does not render when the artwork is in a benefit or gallery auction", () => {
    const PartnerCardArtworkAuction = {
      ...PartnerCardArtwork,
      sale: {
        isBenefit: true,
        isGalleryAuction: true,
      },
    }
    const { toJSON } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => PartnerCardArtworkAuction,
    })

    expect(toJSON()).toBeNull()
  })
})

const PartnerCardArtwork: PartnerCard_artwork$data = {
  sale: {
    isBenefit: false,
    isGalleryAuction: false,
  },
  partner: {
    isDefaultProfilePublic: true,
    type: "Gallery",
    name: "Test Gallery",
    slug: "12345",
    id: "12345",
    href: "",
    initials: "TG",
    profile: {
      id: "12345",
      internalID: "56789",
      icon: {
        url: "https://d32dm0rphc51dk.cloudfront.net/YciR5levjrhp2JnFYlPxpw/square140.webp",
      },
    },
    cities: ["Miami", "New York", "Hong Kong", "London", "Boston"],
  },
  " $fragmentType": "PartnerCard_artwork",
  " $fragmentSpreads": null as any,
}
