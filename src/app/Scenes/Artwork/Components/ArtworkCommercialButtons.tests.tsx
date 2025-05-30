import { OwnerType } from "@artsy/cohesion"
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ArtworkCommercialButtons_Test_Query } from "__generated__/ArtworkCommercialButtons_Test_Query.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtworkStore, ArtworkStoreProvider } from "app/Scenes/Artwork/ArtworkStore"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { navigate } from "app/system/navigation/navigate"
import { ArtworkInquiryStateProvider } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { extractNodes } from "app/utils/extractNodes"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { DateTime } from "luxon"
import { Suspense } from "react"
import { graphql } from "react-relay"
import { ArtworkCommercialButtons } from "./ArtworkCommercialButtons"

describe("ArtworkCommercialButtons", () => {
  let mockArtworkStore: ReturnType<typeof ArtworkStore.useStore>

  const ArtworkStoreDebug = () => {
    mockArtworkStore = ArtworkStore.useStore()
    return null
  }

  const { renderWithRelay } = setupTestWrapper<ArtworkCommercialButtons_Test_Query>({
    Component: (props) => {
      const partnerOffer = extractNodes(props.me!.partnerOffersConnection)[0]

      return (
        <AnalyticsContextProvider
          contextScreenOwnerId={ArtworkFixture.internalID}
          contextScreenOwnerSlug={ArtworkFixture.slug}
          contextScreenOwnerType={OwnerType.artwork}
        >
          <ArtworkInquiryStateProvider>
            <ArtworkStoreProvider>
              <Suspense fallback={null}>
                <ArtworkCommercialButtons
                  partnerOffer={partnerOffer}
                  artwork={props.artwork}
                  me={props.me}
                />
                <ArtworkStoreDebug />
              </Suspense>
            </ArtworkStoreProvider>
          </ArtworkInquiryStateProvider>
        </AnalyticsContextProvider>
      )
    },
    query: graphql`
      query ArtworkCommercialButtons_Test_Query {
        artwork(id: "artworkID") @required(action: NONE) {
          ...ArtworkCommercialButtons_artwork
        }

        me @required(action: NONE) {
          ...ArtworkCommercialButtons_me
          ...useSendInquiry_me
          ...MyProfileEditModal_me
          ...BidButton_me
          partnerOffersConnection(artworkID: "artworkID") {
            edges {
              node {
                ...ArtworkCommercialButtons_partnerOffer
              }
            }
          }
        }
      }
    `,
  })

  it("renders Purchase button if artwork isAcquireable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: false,
      isInquireable: false,
    }

    renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(screen.getByText("Purchase")).toBeOnTheScreen()
    expect(screen.queryByText("Make an Offer")).not.toBeOnTheScreen()
    expect(screen.queryByText("Contact Gallery")).not.toBeOnTheScreen()
  })

  it("renders Make an Offer button if artwork isOfferable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: true,
      isInquireable: false,
    }

    renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(screen.queryByText("Purchase")).not.toBeOnTheScreen()
    expect(screen.getByText("Make an Offer")).toBeOnTheScreen()
    expect(screen.queryByText("Contact Gallery")).not.toBeOnTheScreen()
  })

  it("renders Contact Gallery button if artwork isInquireable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: false,
      isInquireable: true,
    }

    renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(screen.queryByText("Purchase")).not.toBeOnTheScreen()
    expect(screen.queryByText("Make an Offer")).not.toBeOnTheScreen()
    expect(screen.getByText("Contact Gallery")).toBeOnTheScreen()
  })

  it("renders both Purchase and Make an Offer buttons if artwork isOfferable and isAcquireable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: true,
      isInquireable: false,
    }
    renderWithRelay({
      Artwork: () => artwork,
      Me: () => meFixture,
    })

    expect(screen.getByText("Purchase")).toBeOnTheScreen()
    expect(screen.getByText("Make an Offer")).toBeOnTheScreen()
    expect(screen.queryByText("Contact Gallery")).not.toBeOnTheScreen()
  })

  it("renders both Make an Offer and Contact Gallery buttons if artwork isOfferable and isInquireable", () => {
    const artwork = {
      ...ArtworkFixture,
      isOfferable: true,
      isInquireable: true,
    }

    renderWithRelay(
      {
        Artwork: () => artwork,
        Me: () => meFixture,
      },
      {
        auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
      }
    )

    expect(screen.queryByText("Purchase")).not.toBeOnTheScreen()
    expect(screen.getByText("Make an Offer")).toBeOnTheScreen()
    expect(screen.getByText("Contact Gallery")).toBeOnTheScreen()
  })

  it("renders Bid button if artwork is in acution and biddable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isOfferable: false,
      isInquireable: false,
      isInAuction: true,
      sale: {
        slug: "kieran-testing-ios-artwork-page",
        internalID: "5d52f117d063bc0007bcb111",
        registrationStatus: null,
        isPreview: false,
        isOpen: true,
        isLiveOpen: false,
        isClosed: false,
        isRegistrationClosed: false,
        requireIdentityVerification: false,
      },
      saleArtwork: {
        increments: [
          {
            cents: 1600000,
            display: "CHF16,000",
          },
        ],
      },
    }

    renderWithRelay(
      {
        Artwork: () => artwork,
        Me: () => meFixture,
      },
      { auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING }
    )

    expect(screen.getByText("Bid")).toBeOnTheScreen()
  })

  it("renders Purchase and Bid buttons if artwork is in auction and buynowable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isOfferable: false,
      isInquireable: false,
      isInAuction: true,
      isBuyNowable: true,
      saleMessage: "$8000",

      sale: {
        isClosed: false,
        registrationStatus: null,
        isPreview: false,
        isOpen: true,
        isLiveOpen: false,
        isRegistrationClosed: false,
        requireIdentityVerification: false,
      },
      saleArtwork: {
        increments: [{ cents: 320000, display: "€3,200" }],
      },
    }

    renderWithRelay(
      {
        Artwork: () => artwork,
        Me: () => meFixture,
      },
      {
        auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
      }
    )

    expect(screen.getByText("Bid")).toBeOnTheScreen()
    expect(screen.getByText("Purchase $8000")).toBeOnTheScreen()
  })

  describe("with an active partner offer", () => {
    it("renders Purchase button if artwork isAcquireable", () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isOfferable: false,
        isInquireable: false,
      }

      renderWithRelay({
        Artwork: () => artwork,
        Me: () => meWithPartnerOfferFixture,
      })

      expect(screen.getByText("Purchase")).toBeOnTheScreen()
      expect(screen.queryByText("Make an Offer")).not.toBeOnTheScreen()
      expect(screen.queryByText("Contact Gallery")).not.toBeOnTheScreen()
    })

    it("renders both Purchase and Make an Offer buttons if artwork isOfferable", () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: false,
        isOfferable: true,
        isInquireable: false,
      }

      renderWithRelay({
        Artwork: () => artwork,
        Me: () => meWithPartnerOfferFixture,
      })

      expect(screen.getByText("Purchase")).toBeOnTheScreen()
      expect(screen.getByText("Make an Offer")).toBeOnTheScreen()
      expect(screen.queryByText("Contact Gallery")).not.toBeOnTheScreen()
    })

    it("renders both Purchase and Make an Offer buttons if artwork isOfferable and isAcquireable", () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isOfferable: true,
        isInquireable: false,
      }
      renderWithRelay({
        Artwork: () => artwork,
        Me: () => meWithPartnerOfferFixture,
      })

      expect(screen.getByText("Purchase")).toBeOnTheScreen()
      expect(screen.getByText("Make an Offer")).toBeOnTheScreen()
      expect(screen.queryByText("Contact Gallery")).not.toBeOnTheScreen()
    })

    it("renders both Purchase and Contact Gallery buttons if artwork isOfferable and isInquireable", () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isInquireable: true,
      }

      renderWithRelay({
        Artwork: () => artwork,
        Me: () => meWithPartnerOfferFixture,
      })

      expect(screen.getByText("Purchase")).toBeOnTheScreen()
      expect(screen.queryByText("Make an Offer")).not.toBeOnTheScreen()
      expect(screen.getByText("Contact Gallery")).toBeOnTheScreen()
    })

    it("renders both Purchase and Contact Gallery buttons if artwork isInquireable", () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: false,
        isInquireable: true,
      }

      renderWithRelay({
        Artwork: () => artwork,
        Me: () => meWithPartnerOfferFixture,
      })

      expect(screen.getByText("Purchase")).toBeOnTheScreen()
      expect(screen.queryByText("Make an Offer")).not.toBeOnTheScreen()
      expect(screen.getByText("Contact Gallery")).toBeOnTheScreen()
    })
  })

  describe("commits", () => {
    it("the Partner Offer mutation when a partner offer is present", async () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isOfferable: true,
        isInquireable: false,
      }

      const meWithPartnerOffer = {
        ...meFixture,
        partnerOffersConnection: {
          edges: [
            {
              node: {
                internalID: "partnerOfferID",
                // End 1 minute in the future
                endAt: new Date(Date.now() + 60 * 1000).toISOString(),
              },
            },
          ],
        },
      }

      const { mockResolveLastOperation, env } = renderWithRelay({
        Artwork: () => artwork,
        Me: () => meWithPartnerOffer,
      })

      fireEvent.press(screen.getByText("Purchase"))

      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "usePartnerOfferCheckoutMutation"
      )

      await waitFor(() =>
        mockResolveLastOperation({
          CommerceOrderWithMutationSuccess: () => ({
            order: {
              internalID: "buyNowID",
              mode: "BUY",
            },
          }),
        })
      )

      expect(navigate).toHaveBeenCalledWith("/orders/buyNowID", {
        passProps: {
          title: "Purchase",
        },
      })
    })

    it("the Purchase mutation", async () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isOfferable: true,
        isInquireable: false,
      }

      const { mockResolveLastOperation, env } = renderWithRelay({
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      fireEvent.press(screen.getByText("Purchase"))

      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "useCreateOrderMutation"
      )
      await waitFor(() =>
        mockResolveLastOperation({
          CommerceOrderWithMutationSuccess: () => ({
            order: {
              internalID: "buyNowID",
              mode: "BUY",
            },
          }),
        })
      )

      expect(navigate).toHaveBeenCalledWith("/orders/buyNowID", {
        passProps: {
          title: "Purchase",
        },
      })
    })

    it("the Make Offer mutation", () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isOfferable: true,
        isInquireable: false,
      }

      const { mockResolveLastOperation } = renderWithRelay({
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      fireEvent.press(screen.getByText("Make an Offer"))

      mockResolveLastOperation({
        CommerceOrderWithMutationSuccess: () => ({
          order: {
            internalID: "makeOfferID",
            mode: "OFFER",
          },
        }),
      })

      expect(navigate).toHaveBeenCalledWith("/orders/makeOfferID", {
        passProps: {
          orderID: "makeOfferID",
          title: "Make Offer",
        },
      })
    })
  })

  describe("tracking", () => {
    it("trackEvent called when Contact Gallery pressed given Offerable and Inquireable artwork", () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isInquireable: true,
        collectorSignals: null,
      }

      renderWithRelay(
        {
          Artwork: () => artwork,
          Me: () => meFixture,
        },
        { auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING }
      )

      fireEvent.press(screen.getByText("Contact Gallery"))

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedContactGallery",
            "context_module": undefined,
            "context_owner_id": "5b2b745e9c18db204fc32e11",
            "context_owner_slug": "andreas-rod-prinzknecht",
            "context_owner_type": "artwork",
          },
        ]
      `)
    })

    it("trackEvent called when Contact Gallery pressed given Inquireable artwork", () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isInquireable: true,
        collectorSignals: null,
      }

      renderWithRelay(
        {
          Artwork: () => artwork,
          Me: () => meFixture,
        },
        {
          auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
        }
      )

      fireEvent.press(screen.getByText("Contact Gallery"))

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedContactGallery",
            "context_module": undefined,
            "context_owner_id": "5b2b745e9c18db204fc32e11",
            "context_owner_slug": "andreas-rod-prinzknecht",
            "context_owner_type": "artwork",
          },
        ]
      `)
    })

    describe("with an active partner offer", () => {
      it("trackEvent called when Contact Gallery pressed given Offerable and Inquireable artwork", () => {
        const artwork = {
          ...ArtworkFixture,
          isOfferable: true,
          isInquireable: true,
          collectorSignals: { partnerOffer: { internalID: "partnerOfferID" }, auction: null },
        }

        renderWithRelay(
          {
            Artwork: () => artwork,
            Me: () => meFixture,
          },
          { auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING }
        )

        fireEvent.press(screen.getByText("Contact Gallery"))

        expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action": "tappedContactGallery",
              "context_module": undefined,
              "context_owner_id": "5b2b745e9c18db204fc32e11",
              "context_owner_slug": "andreas-rod-prinzknecht",
              "context_owner_type": "artwork",
              "signal_label": "",
            },
          ]
        `)
      })

      it("trackEvent called when Contact Gallery pressed given Inquireable artwork", () => {
        const artwork = {
          ...ArtworkFixture,
          isOfferable: true,
          isInquireable: true,
          collectorSignals: { partnerOffer: { internalID: "partnerOfferID" }, auction: null },
        }

        renderWithRelay(
          {
            Artwork: () => artwork,
            Me: () => meFixture,
          },
          {
            auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
          }
        )

        fireEvent.press(screen.getByText("Contact Gallery"))

        expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action": "tappedContactGallery",
              "context_module": undefined,
              "context_owner_id": "5b2b745e9c18db204fc32e11",
              "context_owner_slug": "andreas-rod-prinzknecht",
              "context_owner_type": "artwork",
              "signal_label": "",
            },
          ]
        `)
      })
    })

    describe("with auction signals", () => {
      it("trackEvent called when Contact Gallery pressed given Offerable and Inquireable artwork", () => {
        const artwork = {
          ...ArtworkFixture,
          isOfferable: true,
          isInquireable: true,
          collectorSignals: {
            auction: {
              lotClosesAt: DateTime.fromMillis(Date.now()).plus({ days: 1 }).toISO(),
              registrationEndsAt: DateTime.fromMillis(Date.now()).minus({ days: 1 }).toISO(),
              liveBiddingStarted: false,
              bidCount: 7,
              lotWatcherCount: 49,
            },
          },
        }

        renderWithRelay(
          {
            Artwork: () => artwork,
            Me: () => meFixture,
          },
          { auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING }
        )

        fireEvent.press(screen.getByText("Contact Gallery"))

        expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action": "tappedContactGallery",
              "context_module": undefined,
              "context_owner_id": "5b2b745e9c18db204fc32e11",
              "context_owner_slug": "andreas-rod-prinzknecht",
              "context_owner_type": "artwork",
              "signal_bid_count": 7,
              "signal_label": "",
              "signal_lot_watcher_count": 49,
            },
          ]
        `)
      })

      it("trackEvent called when Contact Gallery pressed given Inquireable artwork", () => {
        const artwork = {
          ...ArtworkFixture,
          isOfferable: true,
          isInquireable: true,
          collectorSignals: {
            auction: { liveBiddingStarted: true, bidCount: 3, lotWatcherCount: 29 },
          },
        }

        renderWithRelay(
          {
            Artwork: () => artwork,
            Me: () => meFixture,
          },
          {
            auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
          }
        )

        fireEvent.press(screen.getByText("Contact Gallery"))

        expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action": "tappedContactGallery",
              "context_module": undefined,
              "context_owner_id": "5b2b745e9c18db204fc32e11",
              "context_owner_slug": "andreas-rod-prinzknecht",
              "context_owner_type": "artwork",
              "signal_bid_count": 3,
              "signal_label": "",
              "signal_lot_watcher_count": 29,
            },
          ]
        `)
      })
    })
  })

  describe("edition sets", () => {
    describe("with multiple edition sets", () => {
      const editionSets = [
        { internalID: "edition-set-one", isAcquireable: true, isOfferable: true },
        { internalID: "edition-set-two", isAcquireable: true, isOfferable: true },
      ]

      const artworkWithEditionSets = {
        ...ArtworkFixture,
        editionSets,
        isAcquireable: true,
        isOfferable: true,
        isInquireable: false,
      }

      it("does not render the Purchase and Make Offer buttons when edition set is not selected ", () => {
        renderWithRelay({ Artwork: () => artworkWithEditionSets, Me: () => meFixture })

        expect(screen.queryByText("Purchase")).not.toBeOnTheScreen()
        expect(screen.queryByText("Make an Offer")).not.toBeOnTheScreen()
      })

      it("renders the Purchase and Make Offer buttons when edition set is selected ", () => {
        renderWithRelay({ Artwork: () => artworkWithEditionSets, Me: () => meFixture })

        act(() => {
          mockArtworkStore.getActions().setSelectedEditionId(editionSets[0].internalID)
        })

        expect(screen.getByText("Purchase")).toBeOnTheScreen()
        expect(screen.getByText("Make an Offer")).toBeOnTheScreen()
      })
    })

    describe("with one edition set", () => {
      const artworkWithEditionSets = {
        ...ArtworkFixture,
        editionSets: [{ internalID: "edition-set-one", isAcquireable: true, isOfferable: true }],
        isAcquireable: true,
        isOfferable: true,
        isInquireable: false,
      }

      it("renders the Purchase and Make Offer buttons even if the edition set is not selected ", () => {
        renderWithRelay({ Artwork: () => artworkWithEditionSets, Me: () => meFixture })

        act(() => {
          mockArtworkStore.getActions().setSelectedEditionId(null)
        })

        expect(screen.getByText("Purchase")).toBeOnTheScreen()
        expect(screen.getByText("Make an Offer")).toBeOnTheScreen()
      })
    })
  })
})

const meFixture = {
  id: "id",
  isIdentityVerified: true,
  partnerOffersConnection: { edges: [] },
}

const meWithPartnerOfferFixture = {
  id: "id",
  isIdentityVerified: true,
  partnerOffersConnection: {
    edges: [
      {
        node: {
          internalID: "partnerOfferID",
          endAt: new Date(Date.now() + 60 * 1000).toISOString(),
        },
      },
    ],
  },
}
