import { Join, Separator, Spacer } from "@artsy/palette-mobile"
import { FollowedArtistsBankQuery } from "__generated__/FollowedArtistsBankQuery.graphql"
import { ArtistListItemNew } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Components/ArtistListItem"
import { GlobalStore } from "app/store/GlobalStore"
import { Suspense, useDeferredValue, useMemo } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface FollowedArtistsBankContentProps {
  ids: string[]
}

const FollowedArtistsBankContent: React.FC<FollowedArtistsBankContentProps> = ({ ids }) => {
  const data = useLazyLoadQuery<FollowedArtistsBankQuery>(FollowedArtistsBankGQLQuery, { ids })

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
              if (wasFollowed) {
                GlobalStore.actions.onboarding.removeFollowedOnboardingArtist(artist.internalID)
              } else {
                GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
                  internalID: artist.internalID,
                  imageUrl: artist.coverArtwork?.image?.url ?? null,
                  blurhash: artist.coverArtwork?.image?.blurhash ?? null,
                })
              }
            }}
          />
        ))}
      </Join>
      <Separator my={2} />
    </>
  )
}

export const FollowedArtistsBank: React.FC = () => {
  const followedArtists = GlobalStore.useAppState(
    (state) => state.onboarding.followedOnboardingArtists
  )
  const ids = useMemo(() => followedArtists.slice(0, 3).map((a) => a.internalID), [followedArtists])
  const deferredIds = useDeferredValue(ids)

  if (ids.length === 0 && deferredIds.length === 0) return null

  return (
    <Suspense
      fallback={deferredIds.length > 0 ? <FollowedArtistsBankContent ids={deferredIds} /> : null}
    >
      <FollowedArtistsBankContent ids={ids.length > 0 ? ids : deferredIds} />
    </Suspense>
  )
}

const FollowedArtistsBankGQLQuery = graphql`
  query FollowedArtistsBankQuery($ids: [String]) {
    artists(ids: $ids) {
      internalID
      coverArtwork {
        image {
          url
          blurhash
        }
      }
      ...ArtistListItemNew_artist
    }
  }
`
