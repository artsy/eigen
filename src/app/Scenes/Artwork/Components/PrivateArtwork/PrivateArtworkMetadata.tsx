import { PrivateArtworkMetadata_artwork$key } from "__generated__/PrivateArtworkMetadata_artwork.graphql"
import { Expandable } from "app/Components/Expandable"
import { HTML } from "app/Components/HTML"
import { graphql, useFragment } from "react-relay"
interface PrivateArtworkMetadataProps {
  artwork: PrivateArtworkMetadata_artwork$key
}

export const PrivateArtworkMetadata: React.FC<PrivateArtworkMetadataProps> = ({ artwork }) => {
  const data = useFragment(
    graphql`
      fragment PrivateArtworkMetadata_artwork on Artwork {
        conditionDescription {
          details
        }
        privateProvenance: provenance(format: HTML)
        privateExhibitionHistory: exhibitionHistory(format: HTML)
      }
    `,
    artwork
  )

  const isFirstItemExpanded = Boolean(data.conditionDescription?.details)

  const isSecondItemExpanded = Boolean(
    !data.conditionDescription?.details && data.privateProvenance
  )

  const isThirdItemExpanded = Boolean(
    !data.conditionDescription?.details && !data.privateProvenance && data.privateExhibitionHistory
  )

  return (
    <>
      {!!data.conditionDescription?.details && (
        <>
          <Expandable label="Condition" expanded={isFirstItemExpanded}>
            <HTML html={data.conditionDescription?.details} variant="sm" />
          </Expandable>
        </>
      )}

      {!!data.privateProvenance && (
        <>
          <Expandable label="Provenance" expanded={isSecondItemExpanded}>
            <HTML variant="sm" html={data.privateProvenance} />
          </Expandable>
        </>
      )}

      {!!data.privateExhibitionHistory && (
        <Expandable label="Exhibition History" expanded={isThirdItemExpanded}>
          <HTML variant="sm" html={data.privateExhibitionHistory} />
        </Expandable>
      )}
    </>
  )
}
