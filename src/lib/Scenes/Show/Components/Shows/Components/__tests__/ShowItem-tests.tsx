import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { ShowItem } from "../ShowItem"

it("renders without throwing an error", () => {
  renderWithWrappers(<ShowItem show={data as any} />)
})

const data = {
  id: "j-cacciola-gallery-delicate-power-the-delicacy-and-complexity-of-egg-tempera",
  name: "Delicate Power: The Delicacy and Complexity of Egg Tempera",
  images: [
    {
      url: "https://d32dm0rphc51dk.cloudfront.net/6HYZ-tKaXLrcqXCfYxNZQQ/large.jpg",
      aspect_ratio: 0.99,
    },
  ],
  partner: {
    name: "J. Cacciola Gallery",
  },
  location: {
    address: "35 Mill Street",
    address_2: "",
    state: "NJ",
    postal_code: "07924",
  },
}
