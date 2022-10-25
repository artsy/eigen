import { ArtworkEditionSetInformation_artwork$key } from "__generated__/ArtworkEditionSetInformation_artwork.graphql"
import { Spacer, Text } from "palette"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkEditionSets } from "./ArtworkEditionSets"

interface ArtworkEditionSetInformationProps {
  artwork: ArtworkEditionSetInformation_artwork$key
  selectedEditionId: string | null
  onSelectEdition: (editionId: string) => void
}

export const ArtworkEditionSetInformation: React.FC<ArtworkEditionSetInformationProps> = ({
  artwork,
  selectedEditionId,
  onSelectEdition,
}) => {
  const artworkData = useFragment(artworkEditionSetFragment, artwork)
  const editionSets = artworkData.editionSets ?? []
  const selectedEdition = editionSets.find((editionSet) => {
    return editionSet?.internalID === selectedEditionId
  })

  return (
    <>
      <ArtworkEditionSets artwork={artworkData} onSelectEdition={onSelectEdition} />
      {!!selectedEdition?.saleMessage && (
        <>
          <Spacer mb={3} />
          <Text variant="lg-display">{selectedEdition.saleMessage}</Text>
        </>
      )}
    </>
  )
}

const artworkEditionSetFragment = graphql`
  fragment ArtworkEditionSetInformation_artwork on Artwork {
    ...ArtworkEditionSets_artwork
    editionSets {
      internalID
      saleMessage
    }
  }
`
