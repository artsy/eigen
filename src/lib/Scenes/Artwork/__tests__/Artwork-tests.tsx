import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import React from "react"
import { RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"
import { Artwork } from "../Artwork"
import { ArtworkHeader } from "../Components/ArtworkHeader"
import { ContextCard } from "../Components/ContextCard"

const trackEvent = jest.fn()

describe("Artwork", () => {
  beforeEach(() => {
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("renders a snapshot", () => {
    const component = mount(
      <Artwork isVisible artwork={ArtworkFixture as any} relay={{ environment: {} } as RelayRefetchProp} />
    )
    expect(component.find(ArtworkHeader).length).toEqual(1)
  })

  it("refetches on re-appear", () => {
    const refetchMock = jest.fn()
    const component = mount(
      <Artwork
        artwork={ArtworkFixture as any}
        relay={({ environment: {}, refetch: refetchMock } as unknown) as RelayRefetchProp}
        isVisible
      />
    )
    component.setProps({ isVisible: false })
    component.setProps({ isVisible: true })
    expect(refetchMock).toHaveBeenCalled()
  })

  it("does not show a contextCard if the work is in a non-auction sale", () => {
    const nonAuctionSaleArtwork = {
      ...ArtworkFixture,
      context: {
        __typename: "Sale",
        isAuction: false,
      },
    }

    const component = mount(
      <Artwork artwork={nonAuctionSaleArtwork as any} relay={{ environment: {} } as RelayRefetchProp} isVisible />
    )
    expect(component.find(ContextCard).length).toEqual(0)
  })

  it("does show a contextCard if the work is in an auction", () => {
    const auctionSaleArtwork = { ...ArtworkFixture, context: { __typename: "Sale", isAuction: true } }

    const component = mount(
      <Artwork artwork={auctionSaleArtwork as any} relay={{ environment: {} } as RelayRefetchProp} isVisible />
    )
    expect(component.find(ContextCard).length).toEqual(1)
  })
})
