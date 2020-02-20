import { ConsignmentMetadata, ConsignmentSetup } from "../index"

export const withArtist: ConsignmentSetup = { artist: { name: "Glenn Brown", internalID: "gb", image: { url: "" } } }

export const withOnePhoto: ConsignmentSetup = {
  ...withArtist,
  photos: [{ file: "https://d32dm0rphc51dk.cloudfront.net/VFiyokWNcBZNlfglZND_3g/small_square.jpg", uploaded: false }],
}

export const withPhotos: ConsignmentSetup = {
  ...withArtist,
  photos: [
    { file: "https://d32dm0rphc51dk.cloudfront.net/VFiyokWNcBZNlfglZND_3g/small_square.jpg", uploaded: true },
    { file: "https://d32dm0rphc51dk.cloudfront.net/UivXcEE-GMQuBqBiHmvdcg/small_square.jpg", uploaded: true },
  ],
}

export const metadata: ConsignmentMetadata = {
  title: "My Work",
  year: "1983",
  category: "ARCHITECTURE",
  categoryName: "Architecture",
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
