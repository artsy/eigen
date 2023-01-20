import { act } from "@testing-library/react-native"
import { MedianSalePriceAtAuctionQuery } from "__generated__/MedianSalePriceAtAuctionQuery.graphql"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { CareerHighlightBottomSheet, makeCareerHighlightMap } from "./CareerHighlightBottomSheet"
import { MedianSalePriceAtAuctionScreenQuery } from "./MedianSalePriceAtAuction"
import {
  initialValues as medianSalePriceChartDataContextInitialValues,
  MedianSalePriceChartDataContext,
} from "./providers/MedianSalePriceChartDataContext"

jest.unmock("react-relay")
describe(CareerHighlightBottomSheet, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    jest.clearAllMocks()
  })

  const TestRenderer: React.FC<{ contextProps?: any }> = (props) => {
    const data = useLazyLoadQuery<MedianSalePriceAtAuctionQuery>(
      MedianSalePriceAtAuctionScreenQuery,
      {
        artistID: "artist-id",
        artistId: "artist-id",
      }
    )

    return (
      <MedianSalePriceChartDataContext.Provider
        value={{ ...medianSalePriceChartDataContextInitialValues, ...props.contextProps }}
      >
        <CareerHighlightBottomSheet artistSparklines={data} />
      </MedianSalePriceChartDataContext.Provider>
    )
  }

  it("renders nothing if there is no data", () => {
    const { queryByTestId } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)
    expect(queryByTestId("BottomSheetFlatlist")).toBe(null)
  })

  it("renders BottomSheet if there is data and selectedXAxisHighlight", async () => {
    const { queryByTestId } = renderWithHookWrappersTL(
      <TestRenderer contextProps={{ selectedXAxisHighlight: 2015 }} />,
      mockEnvironment
    )
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation({ data: bottomSheetDataMock })
    })

    await flushPromiseQueue()

    expect(queryByTestId("BottomSheetFlatlist")).not.toBe(null)
  })
})

describe(makeCareerHighlightMap, () => {
  it("does not include years before this year minus 8 years", () => {
    const eventDigest = bottomSheetDataMock.analyticsArtistSparklines.edges[0].node.eventDigest
    const result = makeCareerHighlightMap(eventDigest)
    const minimumYear = new Date().getFullYear() - 8
    const inValidYears = Object.keys(result).filter((y) => parseInt(y, 10) < minimumYear)
    const validYears = Object.keys(result).filter((y) => parseInt(y, 10) >= minimumYear)
    expect(inValidYears.length).toEqual(0)
    expect(validYears.length).toBeGreaterThanOrEqual(1)
  })

  it("creates the right map from eventDigest", () => {
    const eventDigest = bottomSheetDataMock.analyticsArtistSparklines.edges[0].node.eventDigest
    const result = makeCareerHighlightMap(eventDigest)
    const expected = { 2015: { Review: ["The Guardian", "Art in America"] } }
    expect(result).toEqual(expected)
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
