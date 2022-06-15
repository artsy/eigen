import { CollectionHubsRails_collection$data } from "__generated__/CollectionHubsRails_collection.graphql"
import { CollectionHubsRails_linkedCollections$data } from "__generated__/CollectionHubsRails_linkedCollections.graphql"
import { CollectionArtistSeriesRailContainer as TrendingArtistSeriesRail } from "app/Scenes/Collection/Components/CollectionHubsRails/ArtistSeries/CollectionArtistSeriesRail"
import { FeaturedCollectionsRailContainer as FeaturedCollectionsRail } from "app/Scenes/Collection/Components/CollectionHubsRails/FeaturedCollections/FeaturedCollectionsRail"
import { Box } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { OtherCollectionsRailContainer as OtherCollectionsRail } from "./OtherCollections/OtherCollectionsRail"

interface CollectionsHubRailsProps {
  linkedCollections: CollectionHubsRails_linkedCollections$data
  collection: CollectionHubsRails_collection$data
}

export const CollectionsHubRails: React.FC<CollectionsHubRailsProps> = (props) => {
  const { collection, linkedCollections, ...others } = props

  return (
    <>
      {linkedCollections.map((collectionGroup) => (
        <Box key={collectionGroup.groupType}>
          {(() => {
            switch (collectionGroup.groupType) {
              case "ArtistSeries":
                return (
                  <TrendingArtistSeriesRail
                    collectionGroup={collectionGroup}
                    collection={collection}
                    {...others}
                  />
                )
              case "OtherCollections":
                return <OtherCollectionsRail collectionGroup={collectionGroup} {...props} />
              case "FeaturedCollections":
                return (
                  <FeaturedCollectionsRail
                    collectionGroup={collectionGroup}
                    collection={collection}
                    {...others}
                  />
                )
            }
          })()}
        </Box>
      ))}
    </>
  )
}

export const CollectionsHubRailsContainer = createFragmentContainer(CollectionsHubRails, {
  linkedCollections: graphql`
    fragment CollectionHubsRails_linkedCollections on MarketingCollectionGroup
    @relay(plural: true) {
      groupType
      ...CollectionArtistSeriesRail_collectionGroup
      ...OtherCollectionsRail_collectionGroup
      ...FeaturedCollectionsRail_collectionGroup
    }
  `,

  collection: graphql`
    fragment CollectionHubsRails_collection on MarketingCollection {
      ...CollectionArtistSeriesRail_collection
      ...FeaturedCollectionsRail_collection
    }
  `,
})
