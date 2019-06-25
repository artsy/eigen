import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { ArtworkInformation } from "../ArtworkInformation"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("ArtworkInformation", () => {
  it("renders all information when the data is present", () => {
    const component = mount(
      <Theme>
        <ArtworkInformation artwork={ArtworkInformationArtwork as any} />
      </Theme>
    )
    expect(component.text()).toContain("Sold")
    expect(component.text()).toContain("I'm a Gallery")
    expect(component.text()).toContain("Consign with Artsy.")
  })
})

const ArtworkInformationArtwork = {
  availability: "Sold",
  partner: {
    name: "I'm a Gallery",
  },
  artists: [
    {
      is_consignable: true,
      " $fragmentRefs": null,
    },
  ],
  " $refType": null,
}
