import { Box, Button, Sans, Serif } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { ViewingRoomArtworkRail } from "../ViewingRoomArtworkRail"
import { ViewingRoomStatement } from "../ViewingRoomStatement"
import { ViewingRoomSubsections } from "../ViewingRoomSubsections"

describe("ViewingRoomStatement", () => {
  const viewingRoom = {
    introStatement: "Introduction Statment",
    body: "Body",
    pullQuote: "Pull Quote",
    artworks: {
      edges: {},
    },
    artworksForCount: {
      totalCount: 51,
    },
    subsections: [
      {
        title: "First",
      },
      {
        title: "Second",
      },
    ],
    " $fragmentRefs": null,
    " $refType": null,
  }
  it("renders an intro statement", () => {
    const wrapper = mount(<ViewingRoomStatement viewingRoom={viewingRoom} />)
    expect(
      wrapper.findWhere(n => {
        return n.type() === Serif && n.text() === viewingRoom.introStatement
      })
    ).toHaveLength(1)
  })
  it("renders an artwork rail with the same props", () => {
    const wrapper = mount(<ViewingRoomStatement viewingRoom={viewingRoom} />)
    expect(wrapper.find(ViewingRoomArtworkRail)).toHaveLength(1)
    expect(wrapper.find(ViewingRoomArtworkRail).props().viewingRoomArtworks).toEqual(viewingRoom)
  })
  it("renders a pull quote", () => {
    const wrapper = mount(<ViewingRoomStatement viewingRoom={viewingRoom} />)
    expect(
      wrapper.findWhere(n => {
        return n.type() === Sans && n.text() === viewingRoom.pullQuote
      })
    ).toHaveLength(1)
  })
  it("renders a body paragraph", () => {
    const wrapper = mount(<ViewingRoomStatement viewingRoom={viewingRoom} />)
    expect(
      wrapper.findWhere(n => {
        return n.type() === Serif && n.text() === viewingRoom.body
      })
    ).toHaveLength(1)
  })
  it("renders the subsections", () => {
    const wrapper = mount(<ViewingRoomStatement viewingRoom={viewingRoom} />)
    expect(wrapper.find(ViewingRoomSubsections)).toHaveLength(1)
    expect(wrapper.find(ViewingRoomSubsections).find(Box)).toHaveLength(2)
  })
  it("renders a button to view artworks", () => {
    const wrapper = mount(<ViewingRoomStatement viewingRoom={viewingRoom} />)
    wrapper.findWhere(n => {
      return n.type() === Button && n.text() === `View works (${viewingRoom.artworksForCount.totalCount})`
    })
  })
})
