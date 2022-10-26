import { ArtworkEditionSets_artwork$key } from "__generated__/ArtworkEditionSets_artwork.graphql"
import { compact } from "lodash"
import { Join, Separator } from "palette"
import { useEffect, useState } from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkEditionSetItem } from "./ArtworkEditionSetItem"

interface ArtworkEditionSetsProps {
  artwork: ArtworkEditionSets_artwork$key
  onSelectEdition: (editionId: string) => void
}

export const ArtworkEditionSets: React.FC<ArtworkEditionSetsProps> = ({
  artwork,
  onSelectEdition,
}) => {
  const artworkData = useFragment(artworkEditionSetsFragment, artwork)
  const editionSets = compact(artworkData.editionSets ?? [])
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

const artworkEditionSetsFragment = graphql`
  fragment ArtworkEditionSets_artwork on Artwork {
    editionSets {
      id
      internalID
      ...ArtworkEditionSetItem_item
    }
  }
`
