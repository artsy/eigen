import { Join, Separator, Spacer } from "@artsy/palette-mobile"
import { FollowedArtistsBankQuery } from "__generated__/FollowedArtistsBankQuery.graphql"
import { ArtistListItemNew } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Components/ArtistListItem"
import { ONBOARDING_AVATAR_SIZE as AVATAR_SIZE } from "app/Scenes/Onboarding/Screens/constants"
import { OnboardingFollowedArtist } from "app/store/OnboardingModel"
import { Suspense, useDeferredValue, useMemo } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface FollowedArtistsBankContentProps {
  ids: string[]
  onArtistFollowed: (artist: OnboardingFollowedArtist, wasFollowed: boolean) => void
}

const FollowedArtistsBankContent: React.FC<FollowedArtistsBankContentProps> = ({
  ids,
  onArtistFollowed,
}) => {
  const data = useLazyLoadQuery<FollowedArtistsBankQuery>(FollowedArtistsBankGQLQuery, {
    ids,
    imageSize: AVATAR_SIZE,
  })

  const artists = (data.artists ?? []).filter((a): a is NonNullable<typeof a> => a !== null)

  if (artists.length === 0) return null

  return (
    <>
      <Join separator={<Spacer y={2} />}>
        {artists.map((artist) => (
          <ArtistListItemNew
            key={artist.internalID}
            artist={artist}
            onFollow={(wasFollowed) => {
              onArtistFollowed(
                {
                  internalID: artist.internalID,
                  imageUrl: artist.coverArtwork?.image?.cropped?.src ?? null,
                  blurhash: artist.coverArtwork?.image?.blurhash ?? null,
                },
                wasFollowed
              )
            }}
          />
        ))}
      </Join>
      <Separator my={2} />
    </>
  )
}

interface FollowedArtistsBankProps {
  followedArtists: OnboardingFollowedArtist[]
  onArtistFollowed: (artist: OnboardingFollowedArtist, wasFollowed: boolean) => void
}

export const FollowedArtistsBank: React.FC<FollowedArtistsBankProps> = ({
  followedArtists,
  onArtistFollowed,
}) => {
  const ids = useMemo(() => followedArtists.slice(0, 3).map((a) => a.internalID), [followedArtists])
  const deferredIds = useDeferredValue(ids)

  if (ids.length === 0 && deferredIds.length === 0) return null

  return (
    <Suspense
      fallback={
        deferredIds.length > 0 ? (
          <FollowedArtistsBankContent ids={deferredIds} onArtistFollowed={onArtistFollowed} />
        ) : null
      }
    >
      <FollowedArtistsBankContent
        ids={ids.length > 0 ? ids : deferredIds}
        onArtistFollowed={onArtistFollowed}
      />
    </Suspense>
  )
}

const FollowedArtistsBankGQLQuery = graphql`
  query FollowedArtistsBankQuery($ids: [String], $imageSize: Int!) {
    artists(ids: $ids) {
      internalID
      coverArtwork {
        image {
          blurhash
          cropped(width: $imageSize, height: $imageSize) {
            src
          }
        }
      }
      ...ArtistListItemNew_artist @arguments(imageSize: $imageSize)
    }
  }
`
