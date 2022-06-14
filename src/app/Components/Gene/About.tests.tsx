import React from "react"
import "react-native"

// Note: test renderer must be required after react-native.
import { renderWithWrappers } from "app/tests/renderWithWrappers"

import { StickyTabPage } from "../StickyTabPage/StickyTabPage"
import About from "./About"

it("renders without throwing a error", () => {
  const gene = {
    description: `Deep time refers to the concept of an expansive time that stretches far beyond human history to
                  include the approximately 4.5 billion-year geological history of Earth and the estimated 13.8
                  billion-year history of the universe. In art, deep time could be explored in works that deal with the
                  long-term processes of geological formation and the cosmos. Such concerns are important, for example,
                  to [Hiroshi Sugimoto](/artist/hiroshi-sugimoto)’s waterscapes and Darren Almond’s landscapes, both of
                  which use long-exposure photography to capture a sense of expanded time.`,
    trending_artists: [
      {
        id: "artist-lita-albuquerque",
        href: "/artist/lita-albuquerque",
        name: "Lita Albuquerque",
        counts: {
          for_sale_artworks: 30,
          artworks: 36,
        },
        image: {
          url: "cloudfront.net/some-url",
        },
      },
      {
        id: "artist-doug-argue",
        href: "/artist/doug-argue",
        name: "Doug Argue",
        counts: {
          for_sale_artworks: 24,
          artworks: 31,
        },
        image: {
          url: "cloudfront.net/some-url",
        },
      },
    ],
  }

  renderWithWrappers(
    <StickyTabPage
      tabs={[
        {
          title: "test",
          content: <About gene={gene as any} />,
        },
      ]}
    />
  )
})
