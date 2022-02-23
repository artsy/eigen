import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { ArtistCard } from "./ArtistCard"

it("renders without throwing a error", () => {
  renderWithWrappers(<ArtistCard artist={artistProps().artist as any} />)
})

const artistProps = () => {
  return {
    artist: {
      id: "QXJ0aXN0Omp1YW4tZ3Jpcw==",
      formattedNationalityAndBirthday: "Spanish, 1887–1927",
      href: "/artist/juan-gris",
      gravityID: "juan-gris",
      internalID: "4d8b934a4eb68a1b2c0012a1",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/wGMxL6TvlSORJzEHZsK9JA/large.jpg",
      },
      name: "Juan Gris",
      artworksConnection: {
        edges: [
          {
            node: {
              image: {
                url: "https://example.com/image.jpg",
              },
            },
          },
        ],
      },
    },
  }
}
