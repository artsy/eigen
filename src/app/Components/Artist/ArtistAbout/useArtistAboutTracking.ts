import {
  ActionType,
  ContextModule,
  OwnerType,
  Screen,
  TappedGene,
  TappedShowGroup,
} from "@artsy/cohesion"
import { screen } from "app/utils/track/helpers"
import { useMemo } from "react"
import { useTracking } from "react-tracking"

interface ArtistProps {
  artistID: string
  artistSlug: string
}

interface TappedShowGroupProps extends ArtistProps {
  showID: string
  showSlug: string
  index: number
}

interface TappedGeneProps extends ArtistProps {
  geneID: string
  geneName: string
}

export const useArtistAboutTracking = () => {
  const { trackEvent } = useTracking()

  return useMemo(
    () => ({
      screen: ({ artistID, artistSlug }: ArtistProps) => {
        const payload: Screen = screen({
          context_screen_owner_type: OwnerType.artistAbout,
          context_screen_owner_id: artistID,
          context_screen_owner_slug: artistSlug,
        })

        trackEvent(payload)
      },

      tappedShowGroup: ({
        artistID,
        artistSlug,
        showID,
        showSlug,
        index,
      }: TappedShowGroupProps) => {
        const payload: TappedShowGroup = {
          action: ActionType.tappedShowGroup,
          context_module: ContextModule.currentShowsRail,
          context_screen_owner_type: OwnerType.artist,
          context_screen_owner_id: artistID,
          context_screen_owner_slug: artistSlug,
          destination_screen_owner_type: OwnerType.show,
          destination_screen_owner_id: showID,
          destination_screen_owner_slug: showSlug,
          horizontal_slide_position: index + 1,
          type: "thumbnail",
        }

        trackEvent(payload)
      },

      tappedGene: ({ artistID, artistSlug, geneID, geneName }: TappedGeneProps) => {
        const payload: TappedGene = {
          action: ActionType.tappedGene,
          context_module: ContextModule.relatedCategories,
          context_screen_owner_type: OwnerType.artist,
          context_screen_owner_id: artistID,
          context_screen_owner_slug: artistSlug,
          destination_screen_owner_type: OwnerType.gene,
          destination_screen_owner_id: geneID,
          subject: geneName,
        }

        trackEvent(payload)
      },
    }),
    [trackEvent]
  )
}
