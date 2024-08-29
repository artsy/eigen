import { useSendInquiry_collectorProfile$data } from "__generated__/useSendInquiry_collectorProfile.graphql"
import { useSendInquiry_me$data } from "__generated__/useSendInquiry_me.graphql"

type InquiryModalMe = NonNullable<useSendInquiry_me$data>
type InquiryModalCollectorProfile = NonNullable<useSendInquiry_collectorProfile$data>

interface userShouldBePromptedToCompleteProfileParams {
  locationDisplay?: NonNullable<InquiryModalMe["location"]>["display"]
  lastUpdatePromptAt: InquiryModalCollectorProfile["lastUpdatePromptAt"]
  profession?: InquiryModalMe["profession"]
}

export const userShouldBePromptedToCompleteProfile = ({
  locationDisplay,
  lastUpdatePromptAt,
  profession,
}: userShouldBePromptedToCompleteProfileParams) => {
  const userHasAnIncompleteProfile = !profession || !locationDisplay

  return (
    userHasAnIncompleteProfile && userHasNotBeenPromptedWithinCooldownPeriod(lastUpdatePromptAt)
  )
}

interface userShouldBePromptedToAddArtistsToCollectionParams {
  lastUpdatePromptAt: InquiryModalCollectorProfile["lastUpdatePromptAt"]
  artworksCount: InquiryModalMe["myCollectionInfo"]["artworksCount"]
  artistsCount: NonNullable<InquiryModalMe["userInterestsConnection"]>["totalCount"]
}

export const userShouldBePromptedToAddArtistsToCollection = ({
  lastUpdatePromptAt,
  artworksCount,
  artistsCount,
}: userShouldBePromptedToAddArtistsToCollectionParams) => {
  const userHasAnEmptyCollection = artworksCount === 0 && artistsCount === 0
  return userHasAnEmptyCollection && userHasNotBeenPromptedWithinCooldownPeriod(lastUpdatePromptAt)
}

const userHasNotBeenPromptedWithinCooldownPeriod = (
  lastPromptAt: InquiryModalCollectorProfile["lastUpdatePromptAt"]
) => {
  if (!lastPromptAt) {
    return true
  }

  const millisecondsSinceLastTimeUserWasPrompted =
    new Date().getTime() - new Date(lastPromptAt).getTime()
  const millisecondsInCooldownPeriod = DAYS_IN_COOLDOWN_PERIOD * 24 * 60 * 60 * 1000

  return millisecondsSinceLastTimeUserWasPrompted > millisecondsInCooldownPeriod
}

export const DAYS_IN_COOLDOWN_PERIOD = 30
