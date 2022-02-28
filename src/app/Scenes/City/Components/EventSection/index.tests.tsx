import { GlobalStoreProvider } from "app/store/GlobalStore"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Theme } from "palette"
import React from "react"
import { RelayProp } from "react-relay"
import { EventSection } from "./index"

const data = [
  {
    name: "PALAY, Trapunto Murals by Pacita Abad",
    id: "U2hvdzpwYWNpdGEtYWJhZC1hcnQtZXN0YXRlLXBhbGF5LXRyYXB1bnRvLW11cmFscy1ieS1wYWNpdGEtYWJhZA==",
    gravityID: "pacita-abad-art-estate-palay-trapunto-murals-by-pacita-abad",
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
      <GlobalStoreProvider>
        <Theme>
          <EventSection
            title="Gallery shows"
            section="galleries"
            citySlug="new-york"
            relay={{ environment: {} } as RelayProp}
            data={data}
          />
        </Theme>
      </GlobalStoreProvider>
    )

    expect(comp.text()).toContain("Gallery shows")
  })
})
