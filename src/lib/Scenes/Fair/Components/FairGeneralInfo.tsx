import { Fair_fair } from "__generated__/Fair_fair.graphql"
import { Separator, Spacer } from "palette"
import React  from "react"
import { FairCollectionsFragmentContainer } from "./FairCollections"
import { FairEditorialFragmentContainer } from "./FairEditorial"
import { FairEmptyStateFragmentContainer } from "./FairEmptyState"
import { FairFollowedArtistsRailFragmentContainer } from "./FairFollowedArtistsRail"
import { FairHeaderFragmentContainer } from "./FairHeader"

interface FairGeneralInfoProps {
  fair: Fair_fair
}

export const FairGeneralInfo: React.FC<FairGeneralInfoProps> = ({ fair }) => {
  const { isActive } = fair
  const hasArticles = !!fair.articles?.edges?.length
  const hasCollections = !!fair.marketingCollections.length
  const hasFollowedArtistArtworks = !!(fair.followedArtistArtworks?.edges?.length ?? 0 > 0)

  return (
    <>
      <FairHeaderFragmentContainer fair={fair} />
      <Separator mt={3} />
      {hasArticles && (
        <>
          <FairEditorialFragmentContainer fair={fair} />
          <Spacer mb={3} />
        </>
      )}
      {isActive ? (
        <>
          {hasCollections && (
            <>
              <FairCollectionsFragmentContainer fair={fair} />
              <Spacer mb={3} />
            </>
          )}
          {hasFollowedArtistArtworks && (
            <>
              <FairFollowedArtistsRailFragmentContainer fair={fair} />
              <Spacer mb={3} />
            </>
          )}
        </>
      ) : (
        <FairEmptyStateFragmentContainer fair={fair} />
      )}
      <Spacer mb={3} />
    </>
  )
}
