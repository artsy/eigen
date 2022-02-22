import { Show } from "app/Scenes/Map/types"
import { GlobalStoreProvider } from "app/store/GlobalStore"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Theme } from "palette"
import React from "react"
import { RelayProp } from "react-relay"
import { Event } from "./index"

const eventData = {
  name: "PALAY, Trapunto Murals by Pacita Abad",
  id: "U2hvdzpwYWNpdGEtYWJhZC1hcnQtZXN0YXRlLXBhbGF5LXRyYXB1bnRvLW11cmFscy1ieS1wYWNpdGEtYWJhZA==",
  internalID: "1234567",
  gravityID: "pacita-abad-art-estate-palay-trapunto-murals-by-pacita-abad",
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
} as any as Show

describe("CityEvent", () => {
  it("renders properly", () => {
    const comp = mount(
      <GlobalStoreProvider>
        <Theme>
          <Event event={eventData} relay={{ environment: {} } as RelayProp} />
        </Theme>
      </GlobalStoreProvider>
    )

    expect(comp.text()).toContain("Pacita Abad Art Estate")
  })
})
