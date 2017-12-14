import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import FairsRail from "../FairsRail"

const fairsModule = {
  results: [
    {
      id: "the-fair",
      name: "The Fair",
      mobile_image: { id: "image", url: "https://neopets.jpg" },
      profile: { href: "https://neopets.com" },
    },
    {
      id: "the-profileless-fair",
      name: "The Profileless Fair: You Should Not See Me in Snapshots",
      mobile_image: { id: "image", url: "https://neopets.jpg" },
      profile: null,
    },
  ],
}

it("looks correct when rendered", () => {
  const tree = renderer.create(<FairsRail fairs_module={fairsModule} />).toJSON()
  expect(tree).toMatchSnapshot()
})
