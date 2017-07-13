import { storiesOf } from "@storybook/react-native"
import * as React from "react"

import TODO from "../Components/ArtworkConsignmentTodo"
import { ConsignmentMetadata, ConsignmentSetup } from "../index"

export const name = "Consignments - TODO"
export const component = TODO

interface States {
  [name: string]: ConsignmentSetup
}

const withArtist: ConsignmentSetup = { artist: { name: "Glenn Brown", id: "gb", image: { url: "" } } }

const withOnePhoto: ConsignmentSetup = {
  ...withArtist,
  photos: ["https://d32dm0rphc51dk.cloudfront.net/VFiyokWNcBZNlfglZND_3g/small_square.jpg"],
}

const withPhotos: ConsignmentSetup = {
  ...withArtist,
  photos: [
    "https://d32dm0rphc51dk.cloudfront.net/VFiyokWNcBZNlfglZND_3g/small_square.jpg",
    "https://d32dm0rphc51dk.cloudfront.net/UivXcEE-GMQuBqBiHmvdcg/small_square.jpg",
  ],
}

const metadata: ConsignmentMetadata = {
  title: "My Work",
  year: "1983",
  category: "Design",
  materials: "Wood",
  width: 100,
  height: 100,
  depth: null,
  unit: "cm",
  displayString: "5/5",
}

const withMetadata: ConsignmentSetup = {
  ...withPhotos,
  metadata,
}

const withLocation: ConsignmentSetup = {
  ...withMetadata,
  location: "Huddersfield, UK",
}

const withProvenance: ConsignmentSetup = {
  ...withLocation,
  provenance: "This work has seen many hands.",
}

const longProv = "This is a long long long run on sentence that should break correctly."

export const allStates: States[] = [
  { "Empty Metadata": {} },
  { "With Artist": withArtist },
  { "With Photos": withPhotos },
  { "With Metadata": withMetadata },
  { "With Location": withMetadata },
  { "With Provenance": withProvenance },
  { "With Just Metadata": { metadata } },
  { "With One": withOnePhoto },
  { "With Long": { provenance: longProv } },
]
