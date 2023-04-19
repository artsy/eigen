import { Separator, Join } from "@artsy/palette-mobile"
import { ArtworkEditionSets_artwork$data } from "__generated__/ArtworkEditionSets_artwork.graphql"
import { compact } from "lodash"
import { useEffect, useState } from "react"
import { createFragmentContainer } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkEditionSetItemFragmentContainer as ArtworkEditionSetItem } from "./ArtworkEditionSetItem"

interface ArtworkEditionSetsProps {
  artwork: ArtworkEditionSets_artwork$data
  onSelectEdition: (editionId: string) => void
}

const ArtworkEditionSets: React.FC<ArtworkEditionSetsProps> = ({ artwork, onSelectEdition }) => {
  const editionSets = compact(artwork.editionSets ?? [])
  const firstEditionId = editionSets[0]?.internalID ?? null
  const [selectedEditionId, setSelectedEditionId] = useState(firstEditionId)

  const handleSelectEdition = (editionId: string) => {
    setSelectedEditionId(editionId)
    onSelectEdition(editionId)
  }

  useEffect(() => {
    if (selectedEditionId) {
      onSelectEdition(selectedEditionId)
    }
  }, [])

  if (editionSets.length === 0) {
    return null
  }

  return (
    <Join separator={<Separator />}>
      {editionSets.map((edition) => {
        const isSelected = edition.internalID === selectedEditionId

        return (
          <ArtworkEditionSetItem
            key={edition.internalID}
            item={edition}
            isSelected={isSelected}
            onPress={handleSelectEdition}
          />
        )
      })}
    </Join>
  )
}

export const ArtworkEditionSetsFragmentContainer = createFragmentContainer(ArtworkEditionSets, {
  artwork: graphql`
    fragment ArtworkEditionSets_artwork on Artwork {
      editionSets {
        id
        internalID
        ...ArtworkEditionSetItem_item
      }
    }
  `,
})
