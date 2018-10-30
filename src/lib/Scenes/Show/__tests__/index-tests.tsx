import React from "react"
import * as renderer from "react-test-renderer"
import Show from "../"

it("Renders a show", () => {
  // TODO: use mocked resolver
  const show = {
    shows: [],
    artworks: [],
    artists: [],
    location: {
      id: "52b0ced8cd530ed44400014f",
      city: "New York",
      address: "25 Central Park West",
      address_2: "",
      coordinates: { lat: 40.770424, lng: -73.981233 },
    },
    partner: { name: "Joseph K. Levene Fine Art, Ltd." },
  }
  const comp = renderer.create(<Show show={show as any} />)
  expect(comp).toMatchSnapshot()
})
