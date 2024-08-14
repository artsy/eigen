import { Box, Tabs, useSpace } from "@artsy/palette-mobile"
import { CollectionOverview_collection$key } from "__generated__/CollectionOverview_collection.graphql"
import { isEmpty } from "lodash"
import { graphql, useFragment } from "react-relay"
import { CollectionsHubRailsContainer as CollectionHubsRails } from "./Components/CollectionHubsRails/index"
import { CollectionFeaturedArtistsContainer as CollectionFeaturedArtists } from "./Components/FeaturedArtists"

interface CollectionProps {
  collection: CollectionOverview_collection$key
}

export const CollectionOverview: React.FC<CollectionProps> = ({ collection }) => {
  const data = useFragment(fragment, collection)
  const space = useSpace()

  if (!data) {
    return null
  }

  return (
    <Tabs.ScrollView style={{ paddingTop: space(2) }}>
      {!!data.showFeaturedArtists && (
        <Box>
          <CollectionFeaturedArtists collection={data} />
        </Box>
      )}
      {!isEmpty(data.linkedCollections) && (
        <Box>
          <CollectionHubsRails linkedCollections={data.linkedCollections} collection={data} />
        </Box>
      )}
    </Tabs.ScrollView>
  )
}

const fragment = graphql`
  fragment CollectionOverview_collection on MarketingCollection {
    showFeaturedArtists
    ...FeaturedArtists_collection
    ...CollectionHubsRails_collection
    linkedCollections {
      ...CollectionHubsRails_linkedCollections
    }
  }
`
