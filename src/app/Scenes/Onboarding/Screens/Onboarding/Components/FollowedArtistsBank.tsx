import { Join, Spacer } from "@artsy/palette-mobile"
import { ArtistListItemNew_artist$key } from "__generated__/ArtistListItemNew_artist.graphql"
import { ArtistListItemNew } from "app/Components/ArtistListItemNew"
import { useOnboardingTracking } from "app/utils/hooks/useOnboardingTracking"

export interface ArtistRef {
  ref: ArtistListItemNew_artist$key
  internalID: string
  slug: string
}

interface FollowedArtistsBankProps {
  artistRefs: ArtistRef[]
  onArtistUnfollowed: (internalID: string) => void
}

export const FollowedArtistsBank: React.FC<FollowedArtistsBankProps> = ({
  artistRefs,
  onArtistUnfollowed,
}) => {
  const { trackArtistFollow } = useOnboardingTracking()

  if (artistRefs.length === 0) return null

  return (
    <Join separator={<Spacer y={2} />}>
      {artistRefs.map(({ ref, internalID, slug }) => (
        <ArtistListItemNew
          key={internalID}
          artist={ref}
          onFollow={() => {}}
          onUnfollow={() => {
            trackArtistFollow(true, internalID, slug)
            onArtistUnfollowed(internalID)
          }}
        />
      ))}
    </Join>
  )
}
