import { Fair2MoreInfoTestsQueryRawResponse } from "__generated__/Fair2MoreInfoTestsQuery.graphql"
import { LocationMapContainer } from "lib/Components/LocationMap"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { Fair2MoreInfoFragmentContainer } from "../Fair2MoreInfo"

jest.unmock("react-relay")

describe("Fair2MoreInfo", () => {
  const getWrapper = async (testFixture: Fair2MoreInfoTestsQueryRawResponse) => {
    return renderRelayTree({
      Component: ({ fair }) => {
        return <Fair2MoreInfoFragmentContainer fair={fair} />
      },
      query: graphql`
        query Fair2MoreInfoTestsQuery($fairID: String!) @raw_response_type {
          fair(id: $fairID) {
            ...Fair2MoreInfo_fair
          }
        }
      `,
      variables: { fairID: "art-basel-hong-kong-2019" },
      mockData: testFixture,
    })
  }

  it("displays more information about the fair", async () => {
    const wrapper = await getWrapper(Fair2MoreInfoFixture)
    expect(wrapper.text()).toContain("This is the about.")
    expect(wrapper.text()).toContain("Buy lots of art")
    expect(wrapper.text()).toContain("LocationA big expo center")
    expect(wrapper.text()).toContain("HoursOpen every day at 5am")
    expect(wrapper.text()).toContain("TicketsTicket info")
    expect(wrapper.text()).toContain("ContactArt Basel Hong Kong")
    expect(wrapper.text()).toContain("Buy Tickets")
    expect(wrapper.text()).toContain("LinksGoogle it")
    expect(wrapper.text()).toContain("View BMW art activations")
    expect(wrapper.find(LocationMapContainer).length).toBe(1)
  })

  it("handles missing information", async () => {
    const Fair2MoreInfoMissingInfo = {
      fair: {
        ...Fair2MoreInfoFixture.fair,
        about: "",
        tagline: "",
        location: null,
        ticketsLink: "",
        fairHours: "",
        fairLinks: "",
        fairTickets: "",
        fairContact: "",
        summary: "",
        sponsoredContent: null,
      },
    } as Fair2MoreInfoTestsQueryRawResponse
    const wrapper = await getWrapper(Fair2MoreInfoMissingInfo)
    expect(wrapper.text()).not.toContain("Location")
    expect(wrapper.text()).not.toContain("Hours")
    expect(wrapper.text()).not.toContain("Buy Tickets")
    expect(wrapper.text()).not.toContain("Links")
    expect(wrapper.text()).not.toContain("Tickets")
    expect(wrapper.text()).not.toContain("Contact")
    expect(wrapper.text()).not.toContain("View BMW art activations")
    expect(wrapper.find(LocationMapContainer).length).toBe(0)
  })
})

const Fair2MoreInfoFixture: Fair2MoreInfoTestsQueryRawResponse = {
  fair: {
    internalID: "abc123",
    slug: "art-basel-hong-kong-2019",
    name: "Art Basel Hong Kong 2019",
    about: "This is the about.",
    summary: "This is the summary.",
    id: "xyz123",
    location: {
      id: "cde123",
      summary: "A big expo center",
      internalID: "asdfasdf",
      postal_code: null,
      city: null,
      address: "",
      address_2: "",
      coordinates: {
        lat: 1,
        lng: 1,
      },
      day_schedules: null,
      openingHours: {
        __typename: "OpeningHoursText",
        text: null,
      },
    },
    sponsoredContent: {
      activationText: "Some activation text",
      pressReleaseUrl: "Some press release text",
    },
    profile: {
      id: "abc123",
      name: "Art Basel Hong Kong 2019",
    },
    tagline: "Buy lots of art",
    fairLinks: "Google it",
    fairContact: "Art Basel Hong Kong",
    fairHours: "Open every day at 5am",
    fairTickets: "Ticket info",
    ticketsLink: "Ticket link",
  },
}
