import { act } from "@testing-library/react-native"
import { MedianSalePriceAtAuctionQuery } from "__generated__/MedianSalePriceAtAuctionQuery.graphql"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { CareerHighlightBottomSheet } from "./CareerHighlightBottomSheet"
import { MedianSalePriceAtAuctionScreenQuery } from "./MedianSalePriceAtAuction"
import { MedianSalePriceChartDataContextProvider } from "./providers/MedianSalePriceChartDataContext"

jest.unmock("react-relay")
describe(CareerHighlightBottomSheet, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    jest.clearAllMocks()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<MedianSalePriceAtAuctionQuery>(
      MedianSalePriceAtAuctionScreenQuery,
      {
        artistID: "artist-id",
        artistId: "artist-id",
      }
    )

    return (
      <MedianSalePriceChartDataContextProvider
        artistId="artistId"
        initialCategory="Painting"
        queryData={data}
      >
        <CareerHighlightBottomSheet artistId="artistId" queryData={data} />
      </MedianSalePriceChartDataContextProvider>
    )
  }

  it("renders nothing if there is no data", () => {
    const { queryByTestId } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)
    expect(queryByTestId("BottomSheetFlatlist")).toBe(null)
  })

  it("renders BottomSheet if there is data", async () => {
    const { queryByTestId } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation({ data: bottomSheetDataMock })
    })

    await flushPromiseQueue()

    expect(queryByTestId("BottomSheetFlatlist")).not.toBe(null)
  })
})

const bottomSheetDataMock = {
  analyticsArtistSparklines: {
    edges: [
      {
        node: {
          eventDigest:
            "2011 Group Show @ MOCA Los Angeles; 2015 Reviewed Solo Show @ The Guardian; 2015 Reviewed Solo Show @ Art in America; ",
          sparkles: "0",
          year: "year_2014",
        },
      },
      {
        node: {
          eventDigest:
            "2011 Group Show @ MOCA Los Angeles; 2015 Reviewed Solo Show @ The Guardian; 2015 Reviewed Solo Show @ Art in America; ",
          sparkles: "10",
          year: "year_2015",
        },
      },
    ],
  },
}
