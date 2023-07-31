import { normalizeText } from "app/utils/normalizeText"

export const filterArtistsByKeyword = (
  artists: (
    | {
        readonly displayLabel?: string | null | undefined
        readonly imageUrl?: string | null | undefined
        readonly initials?: string | null | undefined
        readonly internalID?: string | undefined
      }
    | {
        readonly displayLabel?: string | null
        readonly formattedNationalityAndBirthday?: string | null
        readonly imageUrl?: string | null
        readonly initials?: string | null
        readonly internalID?: string
        readonly isPersonalArtist?: boolean | null
        readonly slug?: string
      }
  )[],
  keywordFilter: string
) => {
  if (keywordFilter.length < 2) {
    return artists
  }

  const normalizedKeywordFilter = normalizeText(keywordFilter)

  if (!normalizedKeywordFilter) {
    return artists
  }

  const keywordFilterWords = normalizedKeywordFilter.split(" ")

  const doAllKeywordFiltersMatch = (artist: {
    readonly displayLabel?: string | null | undefined
    readonly imageUrl?: string | null | undefined
    readonly initials?: string | null | undefined
    readonly internalID?: string | undefined
  }) =>
    keywordFilterWords.filter((word) => !normalizeText(artist?.displayLabel ?? "").includes(word))
      .length === 0

  return artists.filter(doAllKeywordFiltersMatch)
}
