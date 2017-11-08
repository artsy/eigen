import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import ShowPreview from "../ShowPreview"

it("renders correctly for a regular show", () => {
  const tree = renderer.create(<ShowPreview show={show} />)
  expect(tree).toMatchSnapshot()
})

it("renders correctly for a fair booth", () => {
  const tree = renderer.create(<ShowPreview show={show} />)
  expect(tree).toMatchSnapshot()
})

const show = {
  name: "Catty Show",
  cover_image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
  },
  partner: {
    name: "Catty Partner",
  },
  fair: null,
}

const booth = {
  name: "Catty Booth",
  cover_image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
  },
  partner: {
    name: "Catty Partner",
  },
  fair: {
    name: "Catty Fair",
  },
}
