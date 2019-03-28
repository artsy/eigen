import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import { Show } from "lib/Scenes/Map/types"
import React from "react"
import { RelayProp } from "react-relay"
import { Event } from "../index"

// @TODO: This data mock is similarly reused in the event sections; can it be modularized?
const eventData = ({
  name: "PALAY, Trapunto Murals by Pacita Abad",
  __id: "U2hvdzpwYWNpdGEtYWJhZC1hcnQtZXN0YXRlLXBhbGF5LXRyYXB1bnRvLW11cmFscy1ieS1wYWNpdGEtYWJhZA==",
  _id: "1234567",
  id: "pacita-abad-art-estate-palay-trapunto-murals-by-pacita-abad",
  cover_image: {
    url: "",
  },
  is_followed: true,
  end_at: "2001-12-15T12:00:00+00:00",
  start_at: "2001-11-12T12:00:00+00:00",
  exhibition_period: "Feb 11 - 12",
  partner: {
    name: "Pacita Abad Art Estate",
  },
} as any) as Show

describe("CityEvent", () => {
  it("renders properly", () => {
    const comp = mount(
      <Theme>
        <Event event={eventData} relay={{ environment: {} } as RelayProp} />
      </Theme>
    )

    expect(comp.text()).toContain("Pacita Abad Art Estate")
  })
})
