import { screen } from "@testing-library/react-native"
import { ArtworkLotTimer_artwork$data } from "__generated__/ArtworkLotTimer_artwork.graphql"
import { ArtworkStoreProvider } from "app/Scenes/Artwork/ArtworkStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ArtworkLotTimerWrapper } from "./ArtworkLotTimer"

describe("CommercialInformation buttons and coundtown timer", () => {
  beforeEach(() => {
    const dateNow = 1565871720000
    Date.now = () => dateNow
  })

  afterEach(() => jest.clearAllMocks())

  it("renders Lot label and CountDownTimer when Artwork is in an auction", async () => {
    renderWithWrappers(
      <ArtworkStoreProvider>
        <ArtworkLotTimerWrapper
          artwork={artwork}
          tracking={{ trackEvent: jest.fn() } as any}
          refetchArtwork={jest.fn()}
          hasStarted
        />
      </ArtworkStoreProvider>
    )

    expect(screen.queryByText("Lot 123")).toBeTruthy()
    // expect(screen.queryByLabelText("CountdownTimer")).toBeTruthy()
  })

  it("renders CountDownTimer with the sale artwork's end time when Artwork is in a cascading end time auction", () => {
    renderWithWrappers(
      <ArtworkStoreProvider>
        <ArtworkLotTimerWrapper
          artwork={artwork}
          tracking={{ trackEvent: jest.fn() } as any}
          refetchArtwork={jest.fn()}
          hasStarted
        />
      </ArtworkStoreProvider>
    )

    expect(screen.queryByText("Lot 123")).toBeTruthy()
    // expect(screen.queryByLabelText("CountdownTimer")).toBeTruthy()
    // expect(screen.queryByText("3d 7h")).toBeTruthy()
  })

  it("should render bidding closed and no timer if bidding is closed", () => {
    renderWithWrappers(
      <ArtworkStoreProvider>
        <ArtworkLotTimerWrapper
          artwork={
            {
              ...artwork,
              saleArtwork: {
                ...artwork.saleArtwork,
                endedAt: "2019-08-16T20:20:00+00:00",
              },
            } as ArtworkLotTimer_artwork$data
          }
          tracking={{ trackEvent: jest.fn() } as any}
          refetchArtwork={jest.fn()}
          hasStarted
        />
      </ArtworkStoreProvider>
    )

    expect(screen.queryByText("Lot 123")).toBeTruthy()
    expect(screen.queryByText("Bidding closed")).toBeTruthy()
    expect(screen.queryByText("CountdownTimer")).toBeNull()
  })
})

const artwork: ArtworkLotTimer_artwork$data = {
  isInAuction: true,
  isForSale: true,
  sale: {
    cascadingEndTimeIntervalMinutes: 1,
    startAt: "2019-08-14T19:22:00+00:00",
    endAt: "2019-08-18T20:20:00+00:00",
    extendedBiddingIntervalMinutes: null,
    extendedBiddingPeriodMinutes: null,
    internalID: "internal-id",
    isClosed: false,
    isPreview: false,
    liveStartAt: null,
  },
  saleArtwork: {
    endAt: "2019-08-18T20:20:00+00:00",
    endedAt: null,
    extendedBiddingEndAt: null,
    lotID: "internal-id",
    lotLabel: "123",
  },
  collectorSignals: {
    auction: {
      lotWatcherCount: 31,
    },
  },
  " $fragmentType": "ArtworkLotTimer_artwork",
}
