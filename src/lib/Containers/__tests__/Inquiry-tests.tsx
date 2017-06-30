import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import StubContainer from "react-storybooks-relay-container"
import Inquiry from "../Inquiry"

it("renders correctly", () => {
  const tree = renderer.create(<StubContainer Component={Inquiry} props={inquiryProps} />).toJSON()
  expect(tree).toMatchSnapshot()
})

const inquiryProps = {
  inquiry: {
    id: "bradley-theodore-karl-and-anna-face-off-diptych",
    contact_message:
      "Hi, I'm interested in purchasing this work. Could you please provide me with more information about the piece?",
    href: "/artwork/bradley-theodore-karl-and-anna-face-off-diptych",
    title: "Karl and Anna Face Off (Diptych)",
    date: "2016",
    artist_names: "Bradley Theodore",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
    },
    partner: {
      name: "Other Criteria",
    },
  },
}
