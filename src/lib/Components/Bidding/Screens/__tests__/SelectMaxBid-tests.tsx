jest.mock("lib/Components/Bidding/Screens/ConfirmBid/PriceSummary", () => ({
  PriceSummary: () => null,
}))

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { Button } from "palette"
import Spinner from "../../../../Components/Spinner"

import { SelectMaxBid_sale_artwork } from "__generated__/SelectMaxBid_sale_artwork.graphql"
import { BiddingThemeProvider } from "../../Components/BiddingThemeProvider"
import { SelectMaxBid } from "../SelectMaxBid"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))

let fakeRelay: {
  refetch: jest.Mock
}

const navigateMock = jest.fn()
const setParamsMock = jest.fn()

const getNavMock = (params: object = {}) => ({
  navigation: {
    navigate: navigateMock,
    setParams: setParamsMock,
  },
  route: {
    params,
  },
})

beforeEach(() => {
  fakeRelay = {
    refetch: jest.fn(),
  } as any
  // We need to mock timers because we push onto our nav stack and instantiate a ConfirmBid component that has a timer.
  jest.useFakeTimers()
})

it("renders without throwing an error", () => {
  renderWithWrappers(
    <BiddingThemeProvider>
      <SelectMaxBid {...(getNavMock() as any)} sale_artwork={SaleArtwork} relay={fakeRelay as any} />
    </BiddingThemeProvider>
  )
})

it("shows a spinner while fetching new bid increments", () => {
  const component = renderWithWrappers(
    <SelectMaxBid {...(getNavMock() as any)} sale_artwork={SaleArtwork} relay={fakeRelay as any} />
  )

  const selectBidComponent = component.root.findByType(SelectMaxBid)
  selectBidComponent.instance.setState({ isRefreshingSaleArtwork: true })

  expect(component.root.findByType(Spinner)).toBeDefined()
})

it("removes the spinner once the refetch is complete", () => {
  const component = renderWithWrappers(
    <BiddingThemeProvider>
      <SelectMaxBid {...(getNavMock() as any)} sale_artwork={SaleArtwork} relay={fakeRelay as any} />
    </BiddingThemeProvider>
  )
  component.root.findByType(Button).props.onPress()
  expect(navigateMock).toHaveBeenCalled()
  fakeRelay.refetch.mockImplementationOnce((_params, _renderVars, callback) => {
    callback()
  })

  expect(component.root.findAllByType(Spinner).length).toEqual(0)
})

const SaleArtwork = ({
  id: "sale-artwork-id",
  artwork: {
    id: "meteor shower",
    title: "Meteor Shower",
    date: "2015",
    artist_names: "Makiko Kudo",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/5RvuM9YF68AyD8OgcdLw7g/small.jpg",
    },
  },
  sale: {
    id: "best-art-sale-in-town",
  },
  lot_label: "538",
  increments: [
    {
      display: "$35,000",
      cents: 3500000,
    },
    {
      display: "$40,000",
      cents: 4000000,
    },
    {
      display: "$45,000",
      cents: 4500000,
    },
    {
      display: "$50,000",
      cents: 5000000,
    },
    {
      display: "$55,000",
      cents: 5500000,
    },
  ],
} as any) as SelectMaxBid_sale_artwork
