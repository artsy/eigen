import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ToggledAccordion } from "@artsy/cohesion/dist/Schema/Events/UserExperienceInteractions"
import { PrivateArtworkMetadata_artwork$key } from "__generated__/PrivateArtworkMetadata_artwork.graphql"
import { Expandable } from "app/Components/Expandable"
import { HTML } from "app/Components/HTML"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
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

  const { trackEvent } = useTracking()

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
          <Expandable
            onTrack={() => {
              trackEvent(tracks.toggledMetadataAccordion("Condition", isFirstItemExpanded))
            }}
            label="Condition"
            expanded={isFirstItemExpanded}
          >
            <HTML html={data.conditionDescription?.details} variant="sm" />
          </Expandable>
        </>
      )}

      {!!data.privateProvenance && (
        <>
          <Expandable
            onTrack={() => {
              trackEvent(tracks.toggledMetadataAccordion("Provenance", isSecondItemExpanded))
            }}
            label="Provenance"
            expanded={isSecondItemExpanded}
          >
            <HTML variant="sm" html={data.privateProvenance} />
          </Expandable>
        </>
      )}

      {!!data.privateExhibitionHistory && (
        <Expandable
          onTrack={() => {
            trackEvent(tracks.toggledMetadataAccordion("Exhibition History", isThirdItemExpanded))
          }}
          label="Exhibition History"
          expanded={isThirdItemExpanded}
        >
          <HTML variant="sm" html={data.privateExhibitionHistory} />
        </Expandable>
      )}
    </>
  )
}

const tracks = {
  toggledMetadataAccordion: (subject: string, expand: boolean): ToggledAccordion => ({
    action: ActionType.toggledAccordion,
    context_module: ContextModule.aboutTheWork,
    context_owner_type: OwnerType.artwork,
    expand: expand,
    subject: subject,
  }),
}
