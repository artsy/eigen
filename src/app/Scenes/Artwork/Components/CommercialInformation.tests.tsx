import { fireEvent } from "@testing-library/react-native"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ModalStack } from "app/navigation/ModalStack"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import "moment-timezone"
import { ArtworkExtraLinks } from "./ArtworkExtraLinks"
import { BidButton } from "./CommercialButtons/BidButton"
import { BuyNowButton } from "./CommercialButtons/BuyNowButton"
import { CommercialButtons } from "./CommercialButtons/CommercialButtons"
import { CommercialInformationTimerWrapper } from "./CommercialInformation"

describe("CommercialInformation", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      ARArtworkRedesingPhase2: false,
    })
  })

  it("renders all information when the data is present", () => {
    const ForSaleArtwork = {
      ...CommercialInformationArtwork,
      isForSale: true,
      availability: "for sale",
    }

    const { queryByText } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={ForSaleArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(queryByText("For sale")).toBeTruthy()
    expect(queryByText("Consign with Artsy")).toBeTruthy()
  })

  it("returns correct information when artworks is sold", () => {
    const ForSaleArtwork = {
      ...CommercialInformationArtwork,
      isSold: true,
    }

    const { queryByText } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={ForSaleArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(queryByText("For sale")).toBeFalsy()
    expect(queryByText("Sold")).toBeTruthy()
  })

  it("returns correct information for auction works when the auction has ended", () => {
    const Artwork = {
      ...CommercialInformationArtwork,
      isInAuction: true,
      sale: {
        ...CommercialInformationArtwork.sale,
        isClosed: true,
        isAuction: true,
      },
    }

    const { queryByText } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={Artwork as any}
          me={{ identityVerified: false } as any}
          timerState={AuctionTimerState.CLOSED}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(queryByText("For sale")).toBeFalsy()
    expect(queryByText("Bidding closed")).toBeTruthy()
  })

  it("renders correct message when artwork is on hold", () => {
    const OnHoldArtwork = {
      ...CommercialInformationArtwork,
      availability: "on hold",
      saleMessage: null,
    }

    const { queryByText } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={OnHoldArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(queryByText("On hold")).toBeTruthy()
  })

  it("renders correct message when artwork is sold", () => {
    const SoldArtwork = {
      ...CommercialInformationArtwork,
      availability: "sold",
      saleMessage: "Sold",
    }

    const { queryByText } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={SoldArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(queryByText("Sold")).toBeTruthy()
  })

  it("renders correct message when artwork is for sale", () => {
    const ForSaleArtwork = {
      ...CommercialInformationArtwork,
      availability: "for sale",
      saleMessage: "Contact for Price",
    }

    const { queryByText } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={ForSaleArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(queryByText("For sale")).toBeTruthy()
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

    const { queryByText, UNSAFE_queryByType } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={workInEndedAuction as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(queryByText("Bidding closed")).toBeTruthy()
    expect(UNSAFE_queryByType(CommercialButtons)).toBeNull()
  })

  it("doesn't render information when the data is not present", () => {
    const CommercialInformationArtworkNoData = {
      ...ArtworkFixture,
      ...{
        availability: null,
        price: "",
        saleMessage: "",
        isInAuction: false,
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

    const { queryByText } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtworkNoData as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )
    expect(queryByText("For sale")).toBeNull()
    expect(queryByText("I'm a Gallery")).toBeNull()
    expect(queryByText("Consign with Artsy.")).toBeNull()
  })

  it("renders consign with Artsy text", () => {
    const { queryByText } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(queryByText(/Want to sell a work by Santa Claus?/)).toBeTruthy()
    expect(queryByText("Consign with Artsy")).toBeTruthy()
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

    const { UNSAFE_getByType, getByText } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={artworkWithEditionSets as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(UNSAFE_getByType(CommercialButtons)).toHaveProp(
      "editionSetID",
      "5bbb9777ce2fc3002c179013" // pragma: allowlist secret
    )

    fireEvent.press(getByText("1 × 1 in"))

    expect(UNSAFE_getByType(CommercialButtons)).toHaveProp(
      "editionSetID",
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

  afterEach(() => jest.clearAllMocks())

  it("renders CountDownTimer and BidButton when Artwork is in an auction", () => {
    const { queryByLabelText, UNSAFE_queryByType } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtworkInAuction as any}
          me={{ identityVerified: false } as any}
          tracking={{ trackEvent: jest.fn() } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )
    expect(queryByLabelText("Countdown")).toBeTruthy()
    expect(UNSAFE_queryByType(BidButton)).toBeTruthy()
  })

  it("renders CountDownTimer with the sale artwork's end time when Artwork is in a cascading end time auction", () => {
    const { queryByText, queryByLabelText, UNSAFE_queryByType } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtworkInCascadingEndTimeAuction as any}
          me={{ identityVerified: false } as any}
          tracking={{ trackEvent: jest.fn() } as any}
          refetchArtwork={jest.fn()}
          hasStarted
        />
      </ModalStack>
    )

    expect(queryByText("3d 7h")).toBeTruthy()
    expect(queryByLabelText("Countdown")).toBeTruthy()
    expect(UNSAFE_queryByType(BidButton)).toBeTruthy()
  })

  it("doesn't render CountDownTimer, BidButton, or BuyNowButton when artwork is in an auction but sold via buy now", () => {
    const CommercialInformationSoldArtworkInAuction = {
      ...CommercialInformationArtworkInAuction,
      availability: "sold",
      isAcquireable: false,
      isForSale: false,
    }

    const { queryByLabelText, UNSAFE_queryByType } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationSoldArtworkInAuction as any}
          me={{ identityVerified: false } as any}
          tracking={{ trackEvent: jest.fn() } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(queryByLabelText("Countdown")).toBeNull()
    expect(UNSAFE_queryByType(BidButton)).toBeNull()
    expect(UNSAFE_queryByType(BuyNowButton)).toBeNull()
  })

  it("doesn't render CountDownTimer or BidButton when not in auction", () => {
    const { queryByLabelText, UNSAFE_queryByType } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationAcquierableArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(queryByLabelText("Countdown")).toBeNull()
    expect(UNSAFE_queryByType(BidButton)).toBeNull()
    expect(UNSAFE_queryByType(BuyNowButton)).toBeTruthy()
  })

  it("renders CountDownTimer with the sale artwork's end time when Artwork is in a cascading end time auction", () => {
    const { queryByLabelText, UNSAFE_queryByType, queryByText } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={CommercialInformationArtworkInCascadingEndTimeAuction as any}
          me={{ identityVerified: false } as any}
          tracking={{ trackEvent: jest.fn() } as any}
          refetchArtwork={jest.fn()}
          hasStarted
        />
      </ModalStack>
    )

    // This would say 1d 7h if the countdown timer was looking at the sale's end at time (instead of the sale artwork's end at time)
    expect(queryByText("3d 7h")).toBeTruthy()

    expect(queryByLabelText("Countdown")).toBeTruthy()
    expect(UNSAFE_queryByType(BidButton)).toBeTruthy()
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

    const { UNSAFE_queryByType } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={inquireableArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(UNSAFE_queryByType(ArtworkExtraLinks)).toBeNull()
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

    const { UNSAFE_queryByType } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={acquireableArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(UNSAFE_queryByType(ArtworkExtraLinks)).toBeTruthy()
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

    const { UNSAFE_queryByType } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={offerableArtwork as any}
          me={{ identityVerified: false } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(UNSAFE_queryByType(ArtworkExtraLinks)).toBeTruthy()
  })

  it("shows the extra links if the work is biddable", () => {
    const nonConsignableBiddableArtwork = {
      ...CommercialInformationArtworkInAuction,
      artists: [{ isConsignable: false, name: "Santa Claus", " $fragmentRefs": null }],
    }

    const { UNSAFE_queryByType } = renderWithWrappers(
      <ModalStack>
        <CommercialInformationTimerWrapper
          artwork={nonConsignableBiddableArtwork as any}
          me={{ identityVerified: false } as any}
          tracking={{ trackEvent: jest.fn() } as any}
          refetchArtwork={jest.fn()}
        />
      </ModalStack>
    )

    expect(UNSAFE_queryByType(ArtworkExtraLinks)).toBeTruthy()
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
