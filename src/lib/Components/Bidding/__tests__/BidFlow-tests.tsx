import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import relay from "react-relay"
import { Button } from "../Components/Button"
import { Checkbox } from "../Components/Checkbox"
import { MaxBidPicker } from "../Components/MaxBidPicker"
import { MaxBidScreen } from "../Screens/SelectMaxBid"
import { FakeNavigator } from "./Helpers/FakeNavigator"

jest.mock("../../../metaphysics", () => ({ metaphysics: jest.fn() }))
import { metaphysics } from "../../../metaphysics"
import { Title } from "../Components/Title"

const mockphysics = metaphysics as jest.Mock<any>
const fakeNavigator = new FakeNavigator()

jest.useFakeTimers()

const getTitleText = component => component.root.findByType(Title).props.children

it("allows bidders with a qualified credit card to bid", () => {
  let screen = renderer.create(
    <MaxBidScreen me={Me.qualifiedUser} sale_artwork={SaleArtwork} navigator={fakeNavigator as any} />
  )

  screen.root.findByType(MaxBidPicker).instance.props.onValueChange(null, 2)
  screen.root.findByType(Button).instance.props.onPress()

  screen = fakeNavigator.nextStep()

  expect(getTitleText(screen)).toEqual("Confirm your bid")

  mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestedBidder))
  relay.commitMutation = jest.fn((_, { onCompleted }) => onCompleted(mockRequestResponses.placeingBid.bidAccepted))

  screen.root.findByType(Checkbox).instance.props.onPress()
  screen.root.findByType(Button).instance.props.onPress()

  jest.runAllTicks() // Required as metaphysics async call defers execution to next invocation of Node event loop.

  screen = fakeNavigator.nextStep()

  expect(getTitleText(screen)).toEqual("You're the highest bidder")
})

it("allows bidders without a qualified credit card to register a card and bid", () => {
  let screen = renderer.create(
    <MaxBidScreen me={Me.unqualifiedUser} sale_artwork={SaleArtwork} navigator={fakeNavigator as any} />
  )

  screen.root.findByType(MaxBidPicker).instance.props.onValueChange(null, 2)
  screen.root.findByType(Button).instance.props.onPress()

  screen = fakeNavigator.nextStep()

  expect(getTitleText(screen)).toEqual("Confirm your bid")

  mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestedBidder))
  relay.commitMutation = jest.fn((_, { onCompleted }) => onCompleted(mockRequestResponses.placeingBid.bidAccepted))

  // TODO: Add billing address
  // TODO: Add credit card
  // screen.root.findByType(Checkbox).instance.props.onPress()
  // screen.root.findByType(Button).instance.props.onPress()
  // jest.runAllTicks()

  // screen = fakeNavigator.nextStep()

  // expect(getTitleText(screen)).toEqual("You're the highest bidder")
})

const Me = {
  qualifiedUser: {
    has_qualified_credit_cards: true,
  },
  unqualifiedUser: {
    has_qualified_credit_cards: false,
  },
}

const SaleArtwork = {
  artwork: {
    id: "meteor shower",
    title: "Meteor Shower",
    date: "2015",
    artist_names: "Makiko Kudo",
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
  ],
}

const mockRequestResponses = {
  placeingBid: {
    bidAccepted: {
      createBidderPosition: {
        result: {
          status: "SUCCESS",
          position: { id: "some-bidder-position-id" },
        },
      },
    },
  },
  pollingForBid: {
    highestedBidder: {
      data: {
        me: {
          bidder_position: {
            status: "WINNING",
            position: {},
          },
        },
      },
    },
  },
}
