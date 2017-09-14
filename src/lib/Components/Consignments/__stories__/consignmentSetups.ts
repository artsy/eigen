import { ConsignmentMetadata, ConsignmentSetup } from "../index"

export const withArtist: ConsignmentSetup = { artist: { name: "Glenn Brown", id: "gb", image: { url: "" } } }

export const withOnePhoto: ConsignmentSetup = {
  ...withArtist,
  photos: ["https://d32dm0rphc51dk.cloudfront.net/VFiyokWNcBZNlfglZND_3g/small_square.jpg"],
}

export const withPhotos: ConsignmentSetup = {
  ...withArtist,
  photos: [
    "https://d32dm0rphc51dk.cloudfront.net/VFiyokWNcBZNlfglZND_3g/small_square.jpg",
    "https://d32dm0rphc51dk.cloudfront.net/UivXcEE-GMQuBqBiHmvdcg/small_square.jpg",
  ],
}

export const metadata: ConsignmentMetadata = {
  title: "My Work",
  year: "1983",
  category: "Design",
  medium: "Wood",
  width: "100",
  height: "100",
  depth: null,
  unit: "cm",
  displayString: "5/5",
}

export const withMetadata: ConsignmentSetup = {
  ...withPhotos,
  metadata,
}

export const withLocation: ConsignmentSetup = {
  ...withMetadata,
  location: {
    city: "Huddersfield",
    state: "Yorkshire",
    country: "UK",
  },
}
