import { ProgressiveOnboardingCountsQuery } from "__generated__/ProgressiveOnboardingCountsQuery.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { FC } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export interface WithProgressiveOnboardingCountsProps {
  counts: {
    followedArtists: number
    savedArtworks: number
    savedSearches: number
  }
}

type Component = FC<WithProgressiveOnboardingCountsProps>

interface ProgressiveOnboardingCountsProps {
  Component: Component
}

export const ProgressiveOnboardingCounts: FC<ProgressiveOnboardingCountsProps> = ({
  children,
  Component,
}) => {
  const { me } = useLazyLoadQuery<ProgressiveOnboardingCountsQuery>(
    graphql`
      query ProgressiveOnboardingCountsQuery {
        me {
          counts {
            followedArtists
            savedArtworks
            savedSearches
          }
        }
      }
    `,
    {}
  )

  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)

  const counts = me?.counts || {
    savedArtworks: 0,
    followedArtists: 0,
    savedSearches: 0,
  }

  const savedArtworksCount = counts.savedArtworks
  const followedArtistsCount = counts.followedArtists
  const savedSearchesCount = counts.savedSearches

  return !isLoggedIn ? (
    <>children</>
  ) : (
    <Component
      counts={{
        followedArtists: followedArtistsCount,
        savedArtworks: savedArtworksCount,
        savedSearches: savedSearchesCount,
      }}
    >
      {children}
    </Component>
  )
}
