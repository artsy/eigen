import { storiesOf } from "@kadira/react-native-storybook"
import * as React from "react"

import TODO from "../components/artwork-consignment-todo"
import { ConsignmentMetadata, ConsignmentSetup } from "../index"

const withArtist: ConsignmentSetup = { artist: { name: "Glenn Brown" } }
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

storiesOf("Consignments - TODO")
  .add("Empty", () => <TODO />)
  .add("With Artist", () => <TODO {...withArtist} />)
  .add("With Photos", () => <TODO {...withPhotos} />)
  .add("With Metadata", () => <TODO {...withMetadata} />)
  .add("With Location", () => <TODO {...withLocation} />)
  .add("With Provenance", () => <TODO {...withProvenance} />)
  .add("With Just Metadata", () => <TODO metadata={metadata} />)
  .add("With One Photo", () => <TODO {...withOnePhoto} />)
  .add("With Long Provenance", () => <TODO provenance={longProv} />)
