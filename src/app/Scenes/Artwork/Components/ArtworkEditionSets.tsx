import { Separator, Join } from "@artsy/palette-mobile"
import { ArtworkEditionSets_artwork$data } from "__generated__/ArtworkEditionSets_artwork.graphql"
import { compact } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkEditionSetItemFragmentContainer as ArtworkEditionSetItem } from "./ArtworkEditionSetItem"

interface ArtworkEditionSetsProps {
  artwork: ArtworkEditionSets_artwork$data
  onSelectEdition: (editionId: string) => void
}

const ArtworkEditionSets: React.FC<ArtworkEditionSetsProps> = ({ artwork, onSelectEdition }) => {
  const editionSets = compact(artwork.editionSets ?? [])

  const firstAvailableEcommerceEditionSet = useCallback(() => {
    const { editionSets } = artwork
    if (!editionSets || editionSets.length === 0) {
      return undefined
    }

    return editionSets?.find((editionSet) => editionSet?.isAcquireable || editionSet?.isOfferable)
      ?.internalID
  }, [artwork])

  const [selectedEditionId, setSelectedEditionId] = useState(firstAvailableEcommerceEditionSet())

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
        const editionEcommerceAvailable =
          edition.isAcquireable || edition.isOfferable || artwork.isInquireable

        return (
          <ArtworkEditionSetItem
            key={edition.internalID}
            item={edition}
            isSelected={isSelected}
            onPress={handleSelectEdition}
            disabled={!editionEcommerceAvailable}
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
        isAcquireable
        isOfferable
        ...ArtworkEditionSetItem_item
      }
      isInquireable
    }
  `,
})
