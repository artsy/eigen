import {
  filterArtworksParams,
  FilterParamName,
} from "../ArtworkFilterHelpers"
import { prepareFilterParamsForSaveSearchInput } from '../ArtworkFilterSavedSearchHandlers';

describe("prepareFilterParamsForSaveSearchInput", () => {
  it("returns fields in the CreateSavedSearchInput format", () => {
    const filters = filterArtworksParams([
      {
        displayText: "Large (over 100cm)",
        paramName: FilterParamName.dimensionRange,
        paramValue: "40.0-*",
      },
      {
        displayText: "Limited Edition",
        paramName: FilterParamName.attributionClass,
        paramValue: ["limited edition"],
      },
      {
        displayText: "$5,000-10,000",
        paramName: FilterParamName.priceRange,
        paramValue: "5000-10000",
      },
      {
        displayText: "Prints",
        paramName: FilterParamName.additionalGeneIDs,
        paramValue: ["prints"],
      },
      {
        displayText: "Paper",
        paramName: FilterParamName.materialsTerms,
        paramValue: ["paper"],
      },
      {
        displayText: "Bid",
        paramName: FilterParamName.waysToBuyBid,
        paramValue: true,
      },
      {
        displayText: "London, United Kingdom",
        paramName: FilterParamName.locationCities,
        paramValue: ["London, United Kingdom"]
      },
      {
        displayText: "1990-1999",
        paramName: FilterParamName.timePeriod,
        paramValue: ["1990"]
      },
      {
        displayText: "Yellow, Red",
        paramName: FilterParamName.colors,
        paramValue: ["yellow", "red"]
      },
      {
        displayText: "Cypress Test Partner [For Automated Testing Purposes], Tate Ward Auctions",
        paramName: FilterParamName.partnerIDs,
        paramValue: [
          "cypress-test-partner-for-automated-testing-purposes",
          "tate-ward-auctions"
        ]
      },
    ]);

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      priceMin: 5000,
      priceMax: 10000,
      attributionClasses: ["limited edition"],
      additionalGeneIDs: ["prints"],
      atAuction: true,
      majorPeriods: ["1990"],
      colors: ["yellow", "red"],
      locationCities: ["London, United Kingdom"],
      materialsTerms: ["paper"],
      dimensionScoreMin: 40,
      partnerIDs: [
        "cypress-test-partner-for-automated-testing-purposes",
        "tate-ward-auctions"
      ],
    })
  })

  it("returns minPrice and maxPrice fields if only the price filter is selected", () => {
    const filters = filterArtworksParams([
      {
        displayText: "$1,000-5,000",
        paramName: FilterParamName.priceRange,
        paramValue: "1000-5000",
      },
    ]);

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      priceMin: 1000,
      priceMax: 5000,
    })
  })

  it("returns minPrice field if only the minimum price filter is specified", () => {
    const filters = filterArtworksParams([
      {
        displayText: "$50,000+",
        paramName: FilterParamName.priceRange,
        paramValue: "50000-*",
      },
    ]);

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      priceMin: 50000,
    })
  })

  it("returns only the selected `ways to buy` values", () => {
    const filters = filterArtworksParams([
      {
        displayText: "Bid",
        paramName: FilterParamName.waysToBuyBid,
        paramValue: true,
      },
      {
        displayText: "Bid",
        paramName: FilterParamName.waysToBuyInquire,
        paramValue: true,
      },
    ]);

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      atAuction: true,
      inquireableOnly: true,
    })
  })

  it("returns custom filter sizes", () => {
    const filters = filterArtworksParams([
      {
        displayText: "200-250",
        paramName: FilterParamName.height,
        paramValue: "78.74015748031496-98.4251968503937",
      },
      {
        displayText: "100-150",
        paramName: FilterParamName.width,
        paramValue: "39.37007874015748-59.05511811023622",
      },
      {
        displayText: "Custom size",
        paramName: FilterParamName.dimensionRange,
        paramValue: "0-*",
      }
    ]);

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      widthMin: 39.37007874015748,
      widthMax: 59.05511811023622,
      heightMin: 78.74015748031496,
      heightMax: 98.4251968503937,
    })
  })

  it("returns only custom width sizes", () => {
    const filters = filterArtworksParams([
      {
        displayText: "100-150",
        paramName: FilterParamName.width,
        paramValue: "12.5-34.6",
      },
      {
        displayText: "Custom size",
        paramName: FilterParamName.dimensionRange,
        paramValue: "0-*",
      }
    ]);

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      widthMin: 12.5,
      widthMax: 34.6,
    })
  })

  it("returns only custom min height size", () => {
    const filters = filterArtworksParams([
      {
        displayText: "100-150",
        paramName: FilterParamName.width,
        paramValue: "10-*",
      },
      {
        displayText: "Custom size",
        paramName: FilterParamName.dimensionRange,
        paramValue: "0-*",
      }
    ]);

    expect(prepareFilterParamsForSaveSearchInput(filters)).toEqual({
      widthMin: 10,
    })
  })
})
