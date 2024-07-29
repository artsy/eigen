type NullableString = string | null | undefined

interface userShouldBePromptedToCompleteProfileParams {
  city: NullableString
  lastPromptAt: NullableString
  profession: NullableString
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
  lastPromptAt: NullableString
}

export const userShouldBePromptedToAddArtistsToCollection = ({
  lastPromptAt,
}: userShouldBePromptedToAddArtistsToCollectionParams) => {
  const userHasAnEmptyCollection = undefined
  return userHasAnEmptyCollection && userHasNotBeenPromptedWithinCooldownPeriod(lastPromptAt)
}

const userHasNotBeenPromptedWithinCooldownPeriod = (lastPromptAt: NullableString) => {
  if (lastPromptAt == null) {
    return true
  }

  const millisecondsSinceLastTimeUserWasPrompted =
    new Date().getTime() - new Date(lastPromptAt).getTime()
  const millisecondsInCooldownPeriod = daysInCooldownPeriod * 24 * 60 * 60 * 1000

  return millisecondsSinceLastTimeUserWasPrompted > millisecondsInCooldownPeriod
}

export const daysInCooldownPeriod = 30
