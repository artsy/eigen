import { Box } from "@artsy/palette"
import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ArtworkHistory } from "../ArtworkHistory"

storiesOf("Artwork/Components").add("History", () => {
  return (
    <Box mt={4} ml={3}>
      <ArtworkHistory
        artwork={{
          " $refType": null,
          provenance: "This artwork came from my great aunt.",
          exhibition_history:
            "Collection of Ilya and Emilia Kabakov; Sloane Gallery of Art, Denver, Colorado; Armen Petrosyan; Private collection, California. Previously Collection of Ilya and Emilia Kabakov; Sloane Gallery of Art, Denver, Colorado; Armen Petrosyan; Private collection, California. Previously",
          literature: "There's been a lot written about this particular artwork.",
        }}
      />
    </Box>
  )
})
