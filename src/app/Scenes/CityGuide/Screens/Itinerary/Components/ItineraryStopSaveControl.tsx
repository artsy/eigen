import { ItineraryStopSaveControlFairQuery } from "__generated__/ItineraryStopSaveControlFairQuery.graphql"
import { ItineraryStopSaveControlPartnerQuery } from "__generated__/ItineraryStopSaveControlPartnerQuery.graphql"
import { ItineraryStopSaveControlShowQuery } from "__generated__/ItineraryStopSaveControlShowQuery.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import { ItinerarySaveButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySaveButton"
import { ItinerarySaveTarget } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { useFollowShow } from "app/utils/mutations/useFollowShow"
import { Schema } from "app/utils/track"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

type SaveButtonVariant = "icon" | "button"

interface Props {
  saveTarget: ItinerarySaveTarget
  stopTitle: string
  variant?: SaveButtonVariant
}

interface BranchProps {
  slug: string
  stopTitle: string
  variant: SaveButtonVariant
}

export const ItineraryStopSaveControl: React.FC<Props> = ({
  saveTarget,
  stopTitle,
  variant = "icon",
}) => {
  if (saveTarget.type === "SHOW") {
    return <ShowSaveControl slug={saveTarget.slug} stopTitle={stopTitle} variant={variant} />
  }

  if (saveTarget.type === "FAIR") {
    return <FairSaveControl slug={saveTarget.slug} stopTitle={stopTitle} variant={variant} />
  }

  return <PartnerSaveControl slug={saveTarget.slug} stopTitle={stopTitle} variant={variant} />
}

const useSaveToast = () => {
  const toast = useToast()

  return (isNowSaved: boolean) => {
    toast.show(isNowSaved ? "Saved to your saves" : "Removed from your saves", "bottom")
  }
}

const ShowSaveControl: React.FC<BranchProps> = ({ slug, stopTitle, variant }) => {
  const data = useLazyLoadQuery<ItineraryStopSaveControlShowQuery>(ShowQuery, { slug })
  const showToast = useSaveToast()
  const { trackEvent } = useTracking()
  const show = data?.show

  const { followShow, isInFlight } = useFollowShow({
    id: show?.id ?? "",
    internalID: show?.internalID ?? "",
    isFollowed: show?.isFollowed,
    onCompleted: showToast,
  })

  if (!show) return null

  return (
    <ItinerarySaveButton
      variant={variant}
      isSaved={!!show.isFollowed}
      isSaving={isInFlight}
      accessibilityLabel={show.isFollowed ? `Unsave ${stopTitle}` : `Save ${stopTitle}`}
      onPress={() => {
        trackEvent({
          action_name: show.isFollowed
            ? Schema.ActionNames.UnsaveShow
            : Schema.ActionNames.SaveShow,
          action_type: Schema.ActionTypes.Success,
          owner_type: Schema.OwnerEntityTypes.Show,
          owner_id: show.internalID,
          owner_slug: slug,
        })
        followShow()
      }}
    />
  )
}

const PartnerSaveControl: React.FC<BranchProps> = ({ slug, stopTitle, variant }) => {
  const data = useLazyLoadQuery<ItineraryStopSaveControlPartnerQuery>(PartnerQuery, { slug })
  const showToast = useSaveToast()
  const profile = data?.partner?.profile

  const { followProfile, isInFlight } = useFollowProfile({
    id: profile?.id ?? "",
    internalID: profile?.internalID ?? "",
    isFollowed: profile?.isFollowed,
    onCompleted: showToast,
  })

  if (!profile) return null

  return (
    <ItinerarySaveButton
      variant={variant}
      isSaved={!!profile.isFollowed}
      isSaving={isInFlight}
      accessibilityLabel={profile.isFollowed ? `Unfollow ${stopTitle}` : `Follow ${stopTitle}`}
      onPress={followProfile}
    />
  )
}

const ShowQuery = graphql`
  # includeAllShows: true is required, not optional. It defaults to false — "Include shows
  # that are no longer running/active" — so without it a mock built from currently running
  # shows silently loses its save controls as those shows close.
  query ItineraryStopSaveControlShowQuery($slug: String!) {
    show(id: $slug, includeAllShows: true) {
      id
      internalID
      isFollowed
    }
  }
`

const PartnerQuery = graphql`
  query ItineraryStopSaveControlPartnerQuery($slug: String!) {
    partner(id: $slug) {
      profile {
        id
        internalID
        isFollowed
      }
    }
  }
`

/** Fairs follow through fair.profile, the same path partners use. */
const FairSaveControl: React.FC<BranchProps> = ({ slug, stopTitle, variant }) => {
  const data = useLazyLoadQuery<ItineraryStopSaveControlFairQuery>(FairQuery, { slug })
  const showToast = useSaveToast()
  const profile = data?.fair?.profile

  const { followProfile, isInFlight } = useFollowProfile({
    id: profile?.id ?? "",
    internalID: profile?.internalID ?? "",
    isFollowed: profile?.isFollowed,
    onCompleted: showToast,
  })

  if (!profile) return null

  return (
    <ItinerarySaveButton
      variant={variant}
      isSaved={!!profile.isFollowed}
      isSaving={isInFlight}
      accessibilityLabel={profile.isFollowed ? `Unfollow ${stopTitle}` : `Follow ${stopTitle}`}
      onPress={followProfile}
    />
  )
}

const FairQuery = graphql`
  query ItineraryStopSaveControlFairQuery($slug: String!) {
    fair(id: $slug) {
      profile {
        id
        internalID
        isFollowed
      }
    }
  }
`
