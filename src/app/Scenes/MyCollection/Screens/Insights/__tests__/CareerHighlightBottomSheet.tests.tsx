import { screen } from "@testing-library/react-native"
import { MedianSalePriceAtAuctionQuery } from "__generated__/MedianSalePriceAtAuctionQuery.graphql"
import {
  CareerHighlightBottomSheet,
  makeCareerHighlightMap,
  MINIMUM_YEAR,
} from "app/Scenes/MyCollection/Screens/Insights/CareerHighlightBottomSheet"
import { MedianSalePriceAtAuctionScreenQuery } from "app/Scenes/MyCollection/Screens/Insights/MedianSalePriceAtAuction"
import {
  initialValues as medianSalePriceChartDataContextInitialValues,
  MedianSalePriceChartDataContext,
} from "app/Scenes/MyCollection/Screens/Insights/providers/MedianSalePriceChartDataContext"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

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
    renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    expect(screen.queryByTestId("BottomSheetFlatlist")).toBe(null)
  })

  it("renders BottomSheet if there is data and selectedXAxisHighlight", async () => {
    renderWithHookWrappersTL(
      <TestRenderer contextProps={{ selectedXAxisHighlight: 2015 }} />,
      mockEnvironment
    )

    mockEnvironment.mock.resolveMostRecentOperation({ data: bottomSheetDataMock })

    await screen.findByTestId("BottomSheetFlatlist")
  })
})

describe(makeCareerHighlightMap, () => {
  it("returns an empty object if there is no data", () => {
    expect(makeCareerHighlightMap("")).toEqual({})
  })

  it("Prepares the eventDigest and creates a map of each year to the highlight kind", () => {
    const result = makeCareerHighlightMap(
      `2020 Group Show @ MOCA Los Angeles; ${MINIMUM_YEAR} Reviewed Solo Show @ The Guardian; 2018 Reviewed Solo Show @ Art in America`
    )

    expect(result).toEqual({
      [MINIMUM_YEAR]: { Review: ["The Guardian", "Art in America"] },
      2020: { "Group Show": ["MOCA Los Angeles"] },
    })
  })

  it("Returns an empty object if the year is outside the 8-year window", () => {
    const result = makeCareerHighlightMap(
      "2013 Group Show @ MOCA Los Angeles; 2012 Reviewed Solo Show @ The Guardian; 2011 Reviewed Solo Show @ Art in America"
    )

    expect(result).toEqual({})
  })
})

const bottomSheetDataMock = {
  analyticsArtistSparklines: {
    edges: [
      {
        node: {
          eventDigest:
            "2020 Group Show @ MOCA Los Angeles; 2018 Reviewed Solo Show @ The Guardian; 2018 Reviewed Solo Show @ Art in America; ",
          sparkles: "0",
          year: "year_2019",
        },
      },
      {
        node: {
          eventDigest:
            "2020 Group Show @ MOCA Los Angeles; 2018 Reviewed Solo Show @ The Guardian; 2018 Reviewed Solo Show @ Art in America; ",
          sparkles: "10",
          year: "year_2020",
        },
      },
    ],
  },
}
