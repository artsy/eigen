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

  const tracking = useTracking()

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
            trackingFunction={() => {
              tracking.trackEvent(tracks.tappedConditionExpand(isFirstItemExpanded))
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
            trackingFunction={() => {
              tracking.trackEvent(tracks.tappedProvenanceExpand(isSecondItemExpanded))
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
          trackingFunction={() => {
            tracking.trackEvent(tracks.tappedExhibitionHistoryExpand(isThirdItemExpanded))
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
  tappedConditionExpand: (expand: boolean): ToggledAccordion => ({
    action: ActionType.toggledAccordion,
    context_module: ContextModule.aboutTheWork,
    context_owner_type: OwnerType.artwork,
    expand: expand,
    subject: "Condition",
  }),
  tappedProvenanceExpand: (expand: boolean): ToggledAccordion => ({
    action: ActionType.toggledAccordion,
    context_module: ContextModule.aboutTheWork,
    context_owner_type: OwnerType.artwork,
    expand: expand,
    subject: "Provenance",
  }),
  tappedExhibitionHistoryExpand: (expand: boolean): ToggledAccordion => ({
    action: ActionType.toggledAccordion,
    context_module: ContextModule.aboutTheWork,
    context_owner_type: OwnerType.artwork,
    expand: expand,
    subject: "Exhibition History",
  }),
}
