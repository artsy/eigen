import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { AuctionTimerState, Countdown } from "app/Components/Bidding/Components/Timer"
import { ModernTicker, SimpleTicker } from "app/Components/Countdown/Ticker"
import { ModalStack } from "app/navigation/ModalStack"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import "moment-timezone"
import { _test_THEMES, Text, Theme } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ArtworkExtraLinks } from "./ArtworkExtraLinks"
import { BidButton } from "./CommercialButtons/BidButton"
import { BuyNowButton } from "./CommercialButtons/BuyNowButton"
import { CommercialButtons } from "./CommercialButtons/CommercialButtons"
import { CommercialEditionSetInformation } from "./CommercialEditionSetInformation"
import { CommercialInformationTimerWrapper, SaleAvailability } from "./CommercialInformation"

const Wrapper: React.FC<{}> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <GlobalStoreProvider>
        <ModalStack>
          <Theme>{children}</Theme>
        </ModalStack>
      </GlobalStoreProvider>
    </SafeAreaProvider>
  )
}

describe("CommercialInformation", () => {
  beforeEach(() => {
    // TODO: Remove it when AREnableCreateArtworkAlert flag is true in Echo
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCreateArtworkAlert: false })
  })

  it("renders all information when the data is present", () => {
    const ForSaleArtwork = {
      ...CommercialInformationArtwork,
      isForSale: true,
      availability: "for sale",
    }

    const { queryByText } = renderWithWrappersTL(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={ForSaleArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )

    expect(queryByText("For sale")).toBeTruthy()
    expect(queryByText("From I'm a Gallery")).toBeTruthy()
    expect(queryByText("Consign with Artsy")).toBeTruthy()
  })

  it("returns correct information with ff true and artworks is sold", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCreateArtworkAlert: true })
    const ForSaleArtwork = {
      ...CommercialInformationArtwork,
      isSold: true,
    }

    const { queryByText } = renderWithWrappersTL(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={ForSaleArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )

    expect(queryByText("For sale")).toBeFalsy()
    expect(queryByText("Sold")).toBeTruthy()
  })

  it("returns correct information for auction works when the auction has ended and ff true", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCreateArtworkAlert: true })
    const Artwork = {
      ...CommercialInformationArtwork,
      isInAuction: true,
      sale: {
        ...CommercialInformationArtwork.sale,
        isClosed: true,
        isAuction: true,
      },
    }

    const { queryByText } = renderWithWrappersTL(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={Artwork as any}
          me={{ identityVerified: false } as any}
          timerState={AuctionTimerState.CLOSED}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )

    expect(queryByText("For sale")).toBeFalsy()
    expect(queryByText("Bidding closed")).toBeTruthy()
  })

  it("renders yellow indicator and correct message when artwork is on hold", () => {
    const OnHoldArtwork = {
      ...CommercialInformationArtwork,
      availability: "on hold",
      saleMessage: null,
    }

    const component = mount(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={OnHoldArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )

    expect(component.text()).toContain("On hold")
    expect(component.find(SaleAvailability).first().prop("dotColor")).toEqual(
      _test_THEMES.v2.colors.yellow100
    ) // we dont have a v3 yellow yet, so we are keeping the v2 for now.
  })

  it("renders red indicator and correct message when artwork is sold", () => {
    const SoldArtwork = {
      ...CommercialInformationArtwork,
      availability: "sold",
      saleMessage: "Sold",
    }

    const component = mount(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={SoldArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )

    expect(component.text()).toContain("Sold")
    expect(component.find(SaleAvailability).first().prop("dotColor")).toEqual(
      _test_THEMES.v3.colors.red100
    )
  })

  it("renders green indicator and correct message when artwork is for sale", () => {
    const ForSaleArtwork = {
      ...CommercialInformationArtwork,
      availability: "for sale",
      saleMessage: "Contact for Price",
    }

    const component = mount(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={ForSaleArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )

    expect(component.text()).toContain("For sale")
    expect(component.find(SaleAvailability).first().prop("dotColor")).toEqual(
      _test_THEMES.v3.colors.green100
    )
  })

  it("renders Bidding Closed and no CommercialButtons for auction works when the auction has ended", () => {
    const workInEndedAuction = {
      ...CommercialInformationArtwork,
      isInAuction: true,
      isInquireable: true,
      sale: {
        isAuction: true,
        isClosed: true,
      },
      saleArtwork: {
        endAt: "2019-08-16T20:20:00+00:00",
      },
    }
    const component = mount(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={workInEndedAuction as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )

    expect(component.text()).toContain("Bidding closed")
    expect(component.find("CommercialButtons").length).toBe(0)
  })

  it("hides seller info for works from closed auctions", () => {
    const CommercialInformationArtworkClosedAuction = {
      ...CommercialInformationArtwork,
      isInAuction: true,
      sale: {
        isAuction: true,
        isClosed: true,
      },
      saleArtwork: {
        endAt: "2019-08-16T20:20:00+00:00",
      },
    }

    const { queryByText } = renderWithWrappersTL(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtworkClosedAuction as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )

    expect(queryByText("Bidding closed")).toBeTruthy()
    expect(queryByText("I'm a Gallery")).toBeNull()
    expect(queryByText("Shipping, tax, and service quoted by seller")).toBeNull()
    expect(queryByText("Consign with Artsy")).toBeTruthy()
  })

  it("doesn't render information when the data is not present", () => {
    const CommercialInformationArtworkNoData = {
      ...ArtworkFixture,
      ...{
        availability: null,
        price: "",
        saleMessage: "",
        shippingInfo: "",
        isInAuction: false,
        shippingOrigin: null,
        isAcquireable: false,
        isOfferable: false,
        isBiddable: false,
        isInquireable: false,
        isForSale: false,
        editionSets: [],
        sale: {
          isAuction: false,
          isClosed: false,
          isLiveOpen: false,
          isPreview: false,
          liveStartAt: null,
          endAt: null,
          startAt: null,
        },
        partner: {
          name: null,
          " $refType": null,
        },
        artists: [
          {
            isConsignable: false,
            name: "",
            " $fragmentRefs": null,
          },
        ],
        " $fragmentRefs": null,
        " $refType": null,
      },
    }
    const component = mount(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtworkNoData as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )
    expect(component.text()).not.toContain("For sale")
    expect(component.text()).not.toContain("I'm a Gallery")
    expect(component.text()).not.toContain("Consign with Artsy.")
  })

  it("renders seller info correctly for non-commercial works", () => {
    const CommercialInformationArtworkNonCommercial = {
      ...CommercialInformationArtwork,
      availability: null,
      isForSale: false,
    }
    const component = mount(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtworkNonCommercial as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )
    expect(component.find(Text).at(1).render().text()).toMatchInlineSnapshot(`"At I'm a Gallery"`)
  })

  it("renders consign with Artsy text", () => {
    const component = mount(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )

    expect(component.find(Text).at(2).render().text()).toMatchInlineSnapshot(
      `"Want to sell a work by Santa Claus? Consign with Artsy."`
    )
  })

  it("when edition set is selected its internalID is passed to CommercialButtons for mutation", () => {
    const artworkWithEditionSets = {
      ...CommercialInformationArtwork,
      isAcquireable: true,
      isOfferable: true,
      editionSets: [
        {
          id: "RWRpdGlvblNldDo1YmJiOTc3N2NlMmZjMzAwMmMxNzkwMTM=",
          internalID: "5bbb9777ce2fc3002c179013",
          isAcquireable: true,
          isOfferable: true,
          saleMessage: "$1",
          edition_of: "",
          dimensions: {
            in: "2 × 2 in",
            cm: "5.1 × 5.1 cm",
          },
        },
        {
          id: "RWRpdGlvblNldDo1YmMwZWMwMDdlNjQzMDBhMzliMjNkYTQ=",
          internalID: "5bc0ec007e64300a39b23da4",
          isAcquireable: true,
          isOfferable: true,
          saleMessage: "$2",
          edition_of: "",
          dimensions: {
            in: "1 × 1 in",
            cm: "2.5 × 2.5 cm",
          },
        },
      ],
    }

    const component = mount(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={artworkWithEditionSets as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )

    // Expect the component to default to first edition set's internalID
    expect(component.find(CommercialButtons).props().editionSetID).toEqual(
      "5bbb9777ce2fc3002c179013" // pragma: allowlist secret
    )

    const secondEditionButton = component
      .find(CommercialEditionSetInformation)
      .find(TouchableWithoutFeedback)
      .at(2)
    secondEditionButton.props().onPress()
    component.update()

    expect(component.find(CommercialButtons).props().editionSetID).toEqual(
      "5bc0ec007e64300a39b23da4" // pragma: allowlist secret
    )
  })
})

describe("CommercialInformation buttons and coundtown timer", () => {
  beforeEach(() => {
    const dateNow = 1565871720000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds

    // Thursday, May 10, 2018 8:22:32.000 PM UTC
    Date.now = () => dateNow
  })

  describe("when the enable cascading end time feature is on", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCascadingEndTimerLotPage: true })
    })

    afterEach(() => jest.clearAllMocks())

    it("renders CountDownTimer and BidButton when Artwork is in an auction", () => {
      const component = mount(
        <Wrapper>
          <CommercialInformationTimerWrapper
            artwork={CommercialInformationArtworkInAuction as any}
            me={{ identityVerified: false } as any}
            tracking={{ trackEvent: jest.fn() } as any}
            refetchArtwork={jest.fn()}
          />
        </Wrapper>
      )
      expect(component.find(Countdown).length).toEqual(1)
      expect(component.find(BidButton).length).toEqual(1)
    })

    it("renders CountDownTimer with the sale artwork's end time when Artwork is in a cascading end time auction", () => {
      const component = mount(
        <Wrapper>
          <CommercialInformationTimerWrapper
            artwork={CommercialInformationArtworkInCascadingEndTimeAuction as any}
            me={{ identityVerified: false } as any}
            tracking={{ trackEvent: jest.fn() } as any}
            refetchArtwork={jest.fn()}
            hasStarted
          />
        </Wrapper>
      )

      expect(component.find(ModernTicker).length).toEqual(1)
      // This would say 1d 7h if the countdown timer was looking at the sale's end at time (instead of the sale artwork's end at time)
      expect(component.html()).toInclude("3d 7h")
      expect(component.find(Countdown).length).toEqual(1)
      expect(component.find(BidButton).length).toEqual(1)
    })

    it("doesn't render CountDownTimer, BidButton, or BuyNowButton when artwork is in an auction but sold via buy now", () => {
      const CommercialInformationSoldArtworkInAuction = {
        ...CommercialInformationArtworkInAuction,
        availability: "sold",
        isAcquireable: false,
        isForSale: false,
      }

      const component = mount(
        <Wrapper>
          <CommercialInformationTimerWrapper
            artwork={CommercialInformationSoldArtworkInAuction as any}
            me={{ identityVerified: false } as any}
            tracking={{ trackEvent: jest.fn() } as any}
            refetchArtwork={jest.fn()}
          />
        </Wrapper>
      )
      expect(component.find(Countdown).length).toEqual(0)
      expect(component.find(BidButton).length).toEqual(0)
      expect(component.find(BuyNowButton).length).toEqual(0)
    })

    it("doesn't render CountDownTimer or BidButton when not in auction", () => {
      const component = mount(
        <Wrapper>
          <CommercialInformationTimerWrapper
            artwork={CommercialInformationAcquierableArtwork as any}
            me={{ identityVerified: false } as any}
            refetchArtwork={jest.fn()}
          />
        </Wrapper>
      )
      expect(component.find(Countdown).length).toEqual(0)
      expect(component.find(BidButton).length).toEqual(0)
      expect(component.find(BuyNowButton).length).toEqual(1)
    })

    it("renders CountDownTimer with the sale artwork's end time when Artwork is in a cascading end time auction", () => {
      const component = mount(
        <Wrapper>
          <CommercialInformationTimerWrapper
            artwork={CommercialInformationArtworkInCascadingEndTimeAuction as any}
            me={{ identityVerified: false } as any}
            tracking={{ trackEvent: jest.fn() } as any}
            refetchArtwork={jest.fn()}
            hasStarted
          />
        </Wrapper>
      )
      // This would say 1d 7h if the countdown timer was looking at the sale's end at time (instead of the sale artwork's end at time)
      expect(component.html()).toInclude("3d 7h")
      expect(component.find(ModernTicker).length).toEqual(1)
      expect(component.find(Countdown).length).toEqual(1)
      expect(component.find(BidButton).length).toEqual(1)
    })
  })

  describe("when the enable cascading end time feature is off", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCascadingEndTimerLotPage: false })
    })

    afterEach(() => jest.clearAllMocks())

    it("renders CountDownTimer with the sale's end time even when Artwork is in a cascading end time auction", () => {
      const component = mount(
        <Wrapper>
          <CommercialInformationTimerWrapper
            artwork={CommercialInformationArtworkInCascadingEndTimeAuction as any}
            me={{ identityVerified: false } as any}
            tracking={{ trackEvent: jest.fn() } as any}
            refetchArtwork={jest.fn()}
            hasStarted
          />
        </Wrapper>
      )

      expect(component.find(SimpleTicker).length).toEqual(1)
      // This would say 01d  07h  58m  00s if the countdown timer was looking at the sale's end at time (instead of the sale artwork's end at time)
      expect(component.html()).toInclude("03d  07h  58m  00s")
      expect(component.find(Countdown).length).toEqual(1)
      expect(component.find(BidButton).length).toEqual(1)
    })
  })
})

describe("ArtworkExtraLinks", () => {
  it("does not show the extra links if the work is inquireable", () => {
    const inquireableArtwork = {
      ...CommercialInformationArtwork,
      artists: [{ isConsignable: false, name: "Santa Claus", " $fragmentRefs": null }],
      isInquireable: true,
      isAcquireable: false,
      isOfferable: false,
      isInAuction: false,
      isForSale: false,
      sale: {
        isClosed: false,
        isLiveOpen: false,
        isPreview: false,
        liveStartAt: null,
        endAt: null,
        startAt: null,
        isAuction: false,
      },
    }

    const component = mount(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={inquireableArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )
    expect(component.find(ArtworkExtraLinks).length).toEqual(0)
  })

  it("shows the extra links if the work is acquireable", () => {
    const acquireableArtwork = {
      ...CommercialInformationArtwork,
      artists: [{ isConsignable: false, name: "Santa Claus", " $fragmentRefs": null }],
      isInquireable: false,
      isAcquireable: true,
      isOfferable: false,
      isInAuction: false,
      isForSale: true,
      sale: null,
    }

    const component = mount(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={acquireableArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )
    expect(component.find(ArtworkExtraLinks).length).toEqual(1)
  })

  it("shows the extra links if the work is offerable", () => {
    const offerableArtwork = {
      ...CommercialInformationArtwork,
      artists: [{ isConsignable: false, name: "Santa Claus", " $fragmentRefs": null }],
      isInquireable: false,
      isAcquireable: false,
      isOfferable: true,
      isInAuction: false,
      isForSale: true,
      sale: null,
    }

    const component = mount(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={offerableArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )
    expect(component.find(ArtworkExtraLinks).length).toEqual(1)
  })

  it("shows the extra links if the work is biddable", () => {
    const nonConsignableBiddableArtwork = {
      ...CommercialInformationArtworkInAuction,
      artists: [{ isConsignable: false, name: "Santa Claus", " $fragmentRefs": null }],
    }

    const component = mount(
      <Wrapper>
        <CommercialInformationTimerWrapper
          artwork={nonConsignableBiddableArtwork as any}
          me={{ identityVerified: false } as any}
          tracking={{ trackEvent: jest.fn() } as any}
          refetchArtwork={jest.fn()}
        />
      </Wrapper>
    )
    expect(component.find(ArtworkExtraLinks).length).toEqual(1)
  })
})

const CommercialInformationArtwork = {
  ...ArtworkFixture,
  isAcquireable: false,
  isInAuction: false,
  isOfferable: false,
  isBiddable: false,
  isInquireable: false,
  isForSale: true,
  editionSets: [],
  saleMessage: "Contact For Price",
  shippingInfo: "Shipping, tax, and service quoted by seller",
  shippingOrigin: null,
  availability: "sold",
  sale: {
    isClosed: false,
    isAuction: false,
    isLiveOpen: false,
    isPreview: false,
    liveStartAt: null,
    endAt: null,
    startAt: null,
  },
  partner: {
    name: "I'm a Gallery",
    " $refType": null,
  },
  artists: [
    {
      isConsignable: true,
      name: "Santa Claus",
      " $fragmentRefs": null,
    },
  ],
  " $fragmentRefs": null,
  " $refType": null,
}

const CommercialInformationArtworkInAuction = {
  ...CommercialInformationArtwork,
  availability: "for sale",
  isAcquireable: false,
  isInAuction: true,
  sale: {
    internalId: "internal-id",
    slug: "my-sale",
    isClosed: false,
    isAuction: true,
    isLiveOpen: false,
    isPreview: false,
    startAt: "2019-08-15T19:22:00+00:00",
    endAt: "2019-08-16T20:20:00+00:00",
    liveStartAt: null,
    formattedStartDateTime: "Ends Aug 16 at 8:20pm UTC",
  },
  saleArtwork: {
    increments: [
      {
        cents: 11000000,
        display: "CHF110,000",
      },
      {
        cents: 12000000,
        display: "CHF120,000",
      },
    ],
  },
}

const CommercialInformationArtworkInCascadingEndTimeAuction = {
  ...CommercialInformationArtwork,
  availability: "for sale",
  isAcquireable: false,
  isInAuction: true,
  sale: {
    internalId: "internal-id",
    slug: "my-sale",
    isClosed: false,
    isAuction: true,
    isLiveOpen: false,
    isPreview: false,
    startAt: "2019-08-14T19:22:00+00:00",
    endAt: "2019-08-16T20:20:00+00:00",
    liveStartAt: null,
    formattedStartDateTime: "Ends Aug 16 at 8:20pm UTC",
    cascadingEndTimeIntervalMinutes: 1,
  },
  saleArtwork: {
    endAt: "2019-08-18T20:20:00+00:00",
    increments: [
      {
        cents: 11000000,
        display: "CHF110,000",
      },
      {
        cents: 12000000,
        display: "CHF120,000",
      },
    ],
  },
}

const CommercialInformationAcquierableArtwork = {
  ...CommercialInformationArtwork,
  isAcquireable: true,
}
