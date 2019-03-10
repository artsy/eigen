import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { RelayProp } from "react-relay"
import { BMWEventSection } from "../index"

const data = [
  {
    name: "PALAY, Trapunto Murals by Pacita Abad",
    __id: "U2hvdzpwYWNpdGEtYWJhZC1hcnQtZXN0YXRlLXBhbGF5LXRyYXB1bnRvLW11cmFscy1ieS1wYWNpdGEtYWJhZA==",
    id: "pacita-abad-art-estate-palay-trapunto-murals-by-pacita-abad",
    cover_image: {
      url: "",
    },
    end_at: "2001-12-15T12:00:00+00:00",
    start_at: "2001-11-12T12:00:00+00:00",
    partner: {
      name: "Pacita Abad Art Estate",
    },
  },
]

describe("CityEvent", () => {
  it("renders properly", () => {
    const comp = mount(
      <Theme>
        <BMWEventSection
          title="BMW Art Guide"
          sponsoredContent={{
            introText: "Cras justo odio, dapibus ac facilisis in, egestas eget quam.",
            artGuideUrl: "http://www.example.com",
          }}
          relay={{ environment: {} } as RelayProp}
          data={data}
          citySlug={"new-york-us"}
        />
      </Theme>
    )

    expect(comp.text()).toContain("BMW Art Guide")
  })
})
