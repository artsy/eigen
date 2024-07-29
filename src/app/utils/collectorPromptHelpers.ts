import { InquiryModal_me$data } from "__generated__/InquiryModal_me.graphql"

type InquiryModalData = NonNullable<InquiryModal_me$data>

interface userShouldBePromptedToCompleteProfileParams {
  city?: NonNullable<InquiryModalData["location"]>["city"]
  lastPromptAt?: InquiryModalData["collectorProfile"]["lastUpdatePromptAt"]
  profession?: InquiryModalData["profession"]
}

export const userShouldBePromptedToCompleteProfile = ({
  city,
  lastPromptAt,
  profession,
}: userShouldBePromptedToCompleteProfileParams) => {
  const userHasAnIncompleteProfile = !profession || !city
  return userHasAnIncompleteProfile && userHasNotBeenPromptedWithinCooldownPeriod(lastPromptAt)
}

interface userShouldBePromptedToAddArtistsToCollectionParams {
  lastPromptAt?: InquiryModalData["collectorProfile"]["lastUpdatePromptAt"]
}

export const userShouldBePromptedToAddArtistsToCollection = ({
  lastPromptAt,
}: userShouldBePromptedToAddArtistsToCollectionParams) => {
  const userHasAnEmptyCollection = undefined
  return userHasAnEmptyCollection && userHasNotBeenPromptedWithinCooldownPeriod(lastPromptAt)
}

const userHasNotBeenPromptedWithinCooldownPeriod = (
  lastPromptAt?: InquiryModalData["collectorProfile"]["lastUpdatePromptAt"]
) => {
  if (lastPromptAt == null) {
    return true
  }

  const millisecondsSinceLastTimeUserWasPrompted =
    new Date().getTime() - new Date(lastPromptAt).getTime()
  const millisecondsInCooldownPeriod = daysInCooldownPeriod * 24 * 60 * 60 * 1000

  return millisecondsSinceLastTimeUserWasPrompted > millisecondsInCooldownPeriod
}

export const daysInCooldownPeriod = 30
