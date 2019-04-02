import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { FairEventSection } from "../index"

const data = [
  {
    name: "TEFAF New York Fall 2019",
    __id: "RmFpcjp0ZWZhZi1uZXcteW9yay1mYWxsLTIwMTk=",
    id: "tefaf-new-york-fall-2019",
    image: {
      aspect_ratio: 1,
      url: "https://d32dm0rphc51dk.cloudfront.net/3cn9Ln3DfEnHxJcjvfBNKA/wide.jpg",
    },
    end_at: "2001-12-15T12:00:00+00:00",
    start_at: "2001-11-12T12:00:00+00:00",
  },
] as any[]

describe("FairEventSection", () => {
  it("renders properly", () => {
    const comp = mount(
      <Theme>
        <FairEventSection data={data} citySlug="tefaf-new-york-fall-2019" />
      </Theme>
    )

    expect(comp.text()).toContain("TEFAF New York Fall 2019")
  })
})
