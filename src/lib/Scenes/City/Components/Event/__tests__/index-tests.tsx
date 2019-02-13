import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { Event } from "../index"

const eventData = {
  node: {
    name: "PALAY, Trapunto Murals by Pacita Abad",
    __id: "U2hvdzpwYWNpdGEtYWJhZC1hcnQtZXN0YXRlLXBhbGF5LXRyYXB1bnRvLW11cmFscy1ieS1wYWNpdGEtYWJhZA==",
    id: "pacita-abad-art-estate-palay-trapunto-murals-by-pacita-abad",
    images: [],
    end_at: "2001-12-15T12:00:00+00:00",
    start_at: "2001-11-12T12:00:00+00:00",
    partner: {
      name: "Pacita Abad Art Estate",
    },
  },
}

describe("CityEvent", () => {
  it("renders properly", () => {
    const comp = mount(
      <Theme>
        <Event event={eventData} />
      </Theme>
    )

    expect(comp.text()).toContain("Pacita Abad Art Estate")
  })
})
