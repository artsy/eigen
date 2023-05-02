import { ProgressiveOnboardingCountsQuery } from "__generated__/ProgressiveOnboardingCountsQuery.graphql"
import { FC } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ProgressiveOnboardingCountsProps {
  Component: FC<WithProgressiveOnboardingCountsProps>
}

export interface WithProgressiveOnboardingCountsProps {
  counts: {
    savedArtworks: number
  }
}

export const ProgressiveOnboardingCounts: FC<ProgressiveOnboardingCountsProps> = ({
  Component,
  children,
}) => {
  const { me } = useLazyLoadQuery<ProgressiveOnboardingCountsQuery>(
    graphql`
      query ProgressiveOnboardingCountsQuery {
        me {
          counts {
            savedArtworks
          }
        }
      }
    `,
    {}
  )

  const counts = me?.counts || {
    savedArtworks: 0,
  }

  return (
    <Component
      counts={{
        savedArtworks: counts.savedArtworks,
      }}
    >
      {children}
    </Component>
  )
}
