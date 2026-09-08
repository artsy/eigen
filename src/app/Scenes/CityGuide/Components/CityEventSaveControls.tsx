import { useToast } from "app/Components/Toast/toastHook"
import { CityGuideSaveButton } from "app/Scenes/CityGuide/Components/CityGuideSaveButton"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { useFollowShow } from "app/utils/mutations/useFollowShow"
import { Schema } from "app/utils/track"
import { useTracking } from "react-tracking"

interface Props {
  /** Relay node id, for the optimistic store update. */
  id: string
  internalID: string
  isFollowed: boolean | null | undefined
  /** Used for the accessibility label and nothing else. */
  name: string
  /** "icon" is the circular add/check used in rows. "button" is the labelled form the stop preview needs. */
  variant?: "icon" | "button"
}

const useSaveToast = () => {
  const toast = useToast()

  return (isNowSaved: boolean) => {
    toast.show(isNowSaved ? "Saved to your saves" : "Removed from your saves", "bottom")
  }
}

const accessibilityLabel = (isFollowed: boolean, name: string) =>
  isFollowed ? `Unsave ${name}` : `Save ${name}`

/**
 * Save control for a show whose data the caller has already fetched. Unlike
 * `ItineraryStopSaveControl`, which must resolve an entity from a slug, this fires no query.
 */
export const CityEventShowSaveControl: React.FC<Props> = ({
  id,
  internalID,
  isFollowed,
  name,
  variant,
}) => {
  const showToast = useSaveToast()
  const { trackEvent } = useTracking<Schema.Entity>()
  const isSaved = !!isFollowed

  const { followShow, isInFlight } = useFollowShow({
    id,
    internalID,
    isFollowed,
    onCompleted: showToast,
  })

  return (
    <CityGuideSaveButton
      variant={variant}
      isSaved={isSaved}
      isSaving={isInFlight}
      accessibilityLabel={accessibilityLabel(isSaved, name)}
      onPress={() => {
        trackEvent({
          action_name: isSaved ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow,
          action_type: Schema.ActionTypes.Success,
          owner_type: Schema.OwnerEntityTypes.Show,
          owner_id: internalID,
        })
        followShow()
      }}
    />
  )
}

/**
 * Save control for a fair. Following a fair is a profile follow in Gravity
 * (`me/followed_fairs.ts:24` filters on `owner_types: "Fair"`), so `id` and `internalID`
 * here are the fair's profile ids, not the fair's own.
 */
export const CityEventFairSaveControl: React.FC<Props> = ({
  id,
  internalID,
  isFollowed,
  name,
  variant,
}) => {
  const showToast = useSaveToast()
  const { trackEvent } = useTracking<Schema.Entity>()
  const isSaved = !!isFollowed

  const { followProfile, isInFlight } = useFollowProfile({
    id,
    internalID,
    isFollowed,
    onCompleted: showToast,
  })

  return (
    <CityGuideSaveButton
      variant={variant}
      isSaved={isSaved}
      isSaving={isInFlight}
      accessibilityLabel={accessibilityLabel(isSaved, name)}
      onPress={() => {
        // Eigen already has fair-specific names at `track/schema.ts:276-277`. Using SaveShow
        // for a fair would be reusing the wrong existing name, which is worse than inventing one.
        trackEvent({
          action_name: isSaved ? Schema.ActionNames.UnfollowFair : Schema.ActionNames.FollowFair,
          action_type: Schema.ActionTypes.Success,
          owner_type: Schema.OwnerEntityTypes.Fair,
          owner_id: internalID,
        })
        followProfile()
      }}
    />
  )
}

/**
 * Save control for a partner/gallery stop. Following a gallery is also a profile follow, but it
 * tracks under different names. `GalleryFollow` / `GalleryUnfollow` exist at
 * `utils/track/schema.ts:280-281` and are already used elsewhere in the app, by Onboarding, but
 * no City Guide surface sent them before this. `OwnerEntityTypes` has no `Gallery` value, so this
 * uses `Partner`, the type Metaphysics itself uses for a gallery.
 */
export const CityEventPartnerSaveControl: React.FC<Props> = ({
  id,
  internalID,
  isFollowed,
  name,
  variant,
}) => {
  const showToast = useSaveToast()
  const { trackEvent } = useTracking<Schema.Entity>()
  const isSaved = !!isFollowed

  const { followProfile, isInFlight } = useFollowProfile({
    id,
    internalID,
    isFollowed,
    onCompleted: showToast,
  })

  return (
    <CityGuideSaveButton
      variant={variant}
      isSaved={isSaved}
      isSaving={isInFlight}
      accessibilityLabel={accessibilityLabel(isSaved, name)}
      onPress={() => {
        trackEvent({
          action_name: isSaved
            ? Schema.ActionNames.GalleryUnfollow
            : Schema.ActionNames.GalleryFollow,
          action_type: Schema.ActionTypes.Success,
          owner_type: Schema.OwnerEntityTypes.Partner,
          owner_id: internalID,
        })
        followProfile()
      }}
    />
  )
}
