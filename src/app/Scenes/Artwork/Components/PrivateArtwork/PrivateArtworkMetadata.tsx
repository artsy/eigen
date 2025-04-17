import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ToggledAccordion } from "@artsy/cohesion/dist/Schema/Events/UserExperienceInteractions"
import { LinkText, Spacer } from "@artsy/palette-mobile"
import { PrivateArtworkMetadata_artwork$key } from "__generated__/PrivateArtworkMetadata_artwork.graphql"
import { Expandable } from "app/Components/Expandable"
import { HTML } from "app/Components/HTML"
import { navigate } from "app/system/navigation/navigate"
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
        privateProvenance: provenance(format: MARKDOWN)
        privateExhibitionHistory: exhibitionHistory(format: MARKDOWN)
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
            <Spacer y={2} />
            <HTML html={data.conditionDescription?.details} variant="sm" />
            <Spacer y={1} />
            <LinkText
              variant="xs"
              color="mono60"
              onPress={() =>
                navigate(`https://help.artsy.net/s/article/Artsy-Condition-Definitions`)
              }
            >
              Learn more
            </LinkText>
            <Spacer y={1} />
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
            <Spacer y={2} />
            <HTML variant="sm" html={data.privateProvenance} />
            <Spacer y={1} />
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
          <Spacer y={2} />
          <HTML variant="sm" html={data.privateExhibitionHistory} />
          <Spacer y={1} />
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
