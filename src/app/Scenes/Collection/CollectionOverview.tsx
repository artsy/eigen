import { Box, Tabs, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { CollectionOverview_collection$key } from "__generated__/CollectionOverview_collection.graphql"
import { ReadMore } from "app/Components/ReadMore"
import { Schema } from "app/utils/track"
import { graphql, useFragment } from "react-relay"
import { CollectionsHubRailsContainer as CollectionHubsRails } from "./Components/CollectionHubsRails/index"
import { CollectionFeaturedArtistsContainer as CollectionFeaturedArtists } from "./Components/FeaturedArtists"

interface CollectionProps {
  collection: CollectionOverview_collection$key
}

export const CollectionOverview: React.FC<CollectionProps> = ({ collection }) => {
  const data = useFragment(fragment, collection)
  const space = useSpace()
  const { width: screenWidth } = useScreenDimensions()

  if (!data) {
    return null
  }

  return (
    <Tabs.ScrollView style={{ paddingTop: space(2) }}>
      {!!data.collectionDescription && (
        <Box mb={4} mt={0.5} accessibilityLabel="Read more">
          <ReadMore
            content={data.collectionDescription}
            maxChars={screenWidth > 700 ? 300 : 250} // truncate at 300 characters on iPads and 250 on all other devices
            contextModule={Schema.ContextModules.CollectionDescription}
            trackingFlow={Schema.Flow.AboutTheCollection}
            textStyle="sans"
          />
        </Box>
      )}
      {!!data.showFeaturedArtists && (
        <Box>
          <CollectionFeaturedArtists collection={data} />
        </Box>
      )}
      {!!data.linkedCollections && (
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
    isDepartment
    collectionDescription: descriptionMarkdown
    ...FeaturedArtists_collection
    ...CollectionHubsRails_collection
    linkedCollections {
      ...CollectionHubsRails_linkedCollections
    }
  }
`
