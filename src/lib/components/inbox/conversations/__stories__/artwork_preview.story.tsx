import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import "react-native"

import ArtworkPreview from "../artwork_preview"

const artwork = {
  id: "kara-walker-canisters-1",
  title: "Canisters",
  date: "1997",
  artist_names: "Kara Walker",
  image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
  },
}

storiesOf("Conversation - Artwork Preview").add("Alone", () => <ArtworkPreview artwork={artwork} />)
