jest.mock("app/Components/Bidding/Screens/ConfirmBid/PriceSummary", () => ({
  PriceSummary: () => null,
}))

import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { FakeNavigator } from "../Helpers/FakeNavigator"

import Spinner from "app/Components/Spinner"
import { Button } from "palette"

import { SelectMaxBid_me } from "__generated__/SelectMaxBid_me.graphql"
import { SelectMaxBid_sale_artwork } from "__generated__/SelectMaxBid_sale_artwork.graphql"
import { ActivityIndicator } from "react-native"
import { SelectMaxBid } from "./SelectMaxBid"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))

const Me = {
  has_qualified_credit_cards: true,
} as any as SelectMaxBid_me

const SaleArtwork = {
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
} as any as SelectMaxBid_sale_artwork

let fakeNavigator: FakeNavigator
let fakeRelay: {
  refetch: jest.Mock
}

beforeEach(() => {
  fakeNavigator = new FakeNavigator()
  fakeRelay = {
    refetch: jest.fn(),
  } as any
  // We need to mock timers because we push onto our nav stack and instantiate a ConfirmBid component that has a timer.
  jest.useFakeTimers()
})

it("renders without throwing an error", () => {
  renderWithWrappers(
    <SelectMaxBid
      me={Me}
      sale_artwork={SaleArtwork}
      navigator={fakeNavigator as any}
      relay={fakeRelay as any}
    />
  )
})

it("shows a spinner while fetching new bid increments", () => {
  const component = renderWithWrappers(
    <SelectMaxBid
      me={Me}
      sale_artwork={SaleArtwork}
      navigator={fakeNavigator as any}
      relay={fakeRelay as any}
    />
  )

  const selectBidComponent = component.root.findByType(SelectMaxBid)
  selectBidComponent.instance.setState({ isRefreshingSaleArtwork: true })

  expect(component.root.findByType(ActivityIndicator)).toBeDefined()
})

it("refetches in next component's refreshSaleArtwork", () => {
  const component = renderWithWrappers(
    <SelectMaxBid
      me={Me}
      sale_artwork={SaleArtwork}
      navigator={fakeNavigator as any}
      relay={fakeRelay as any}
    />
  )
  component.root.findByType(Button).props.onPress()
  const nextScreen = fakeNavigator.nextStep()

  nextScreen.root.findByProps({ nextScreen: true }).instance.props.refreshSaleArtwork()

  expect(fakeRelay.refetch).toHaveBeenCalledWith(
    { saleArtworkNodeID: "sale-artwork-id" },
    null,
    expect.anything(),
    {
      force: true,
    }
  )
  expect(component.root.findByType(ActivityIndicator)).toBeDefined()
})

it("removes the spinner once the refetch is complete", () => {
  const component = renderWithWrappers(
    <SelectMaxBid
      me={Me}
      sale_artwork={SaleArtwork}
      navigator={fakeNavigator as any}
      relay={fakeRelay as any}
    />
  )
  component.root.findByType(Button).props.onPress()
  const nextScreen = fakeNavigator.nextStep()
  fakeRelay.refetch.mockImplementationOnce((_params, _renderVars, callback) => {
    callback()
  })

  nextScreen.root.findByProps({ nextScreen: true }).instance.props.refreshSaleArtwork()

  expect(component.root.findAllByType(Spinner).length).toEqual(0)
})
