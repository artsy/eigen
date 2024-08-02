import { ShareIcon, Spinner, Tabs } from "@artsy/palette-mobile"
import { CollectionQuery } from "__generated__/CollectionQuery.graphql"
import { Collection_collection$key } from "__generated__/Collection_collection.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { useToast } from "app/Components/Toast/toastHook"
import { CollectionOverview } from "app/Scenes/Collection/CollectionOverview"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "app/Scenes/Collection/Screens/CollectionArtworks"
import { CollectionHeader } from "app/Scenes/Collection/Screens/CollectionHeader"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { Suspense } from "react"
import { TouchableOpacity } from "react-native"
import RNShare from "react-native-share"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface CollectionScreenProps {
  collectionID: string
}

interface CollectionProps {
  collection: Collection_collection$key
}

export const CollectionContent: React.FC<CollectionProps> = ({ collection }) => {
  const data = useFragment(fragment, collection)
  const { show: showToast } = useToast()

  const shouldRenderOverviewTab =
    !!data?.descriptionMarkdown && !!data?.showFeaturedArtists && !!data?.linkedCollections

  if (!data) {
    return null
  }

  const { slug, id, title } = data

  const trackingInfo: Schema.PageView = {
    context_screen: Schema.PageNames.Collection,
    context_screen_owner_slug: slug,
    context_screen_owner_id: id,
    context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
  }

  const handleSharePress = async () => {
    try {
      const url = getShareURL(`/collection/${slug}?utm_content=collection-share`)
      const message = `View ${title} on Artsy`

      await RNShare.open({
        title: title,
        message: message + "\n" + url,
        failOnCancel: true,
      })
      showToast("Copied to Clipboard", "middle", { Icon: ShareIcon })
    } catch (error) {
      if (typeof error === "string" && error.includes("User did not share")) {
        console.error("Collection.tsx", error)
      }
    }
  }

  return (
    <ProvideScreenTracking info={trackingInfo}>
      <ArtworkFiltersStoreProvider>
        <Tabs.TabsWithHeader
          initialTabName={shouldRenderOverviewTab ? "Overview" : "Artworks"}
          title={`${title}`}
          showLargeHeaderText={false}
          BelowTitleHeaderComponent={() => <CollectionHeader collection={data} />}
          headerProps={{
            onBack: goBack,
            rightElements: (
              <TouchableOpacity
                onPress={() => {
                  handleSharePress()
                }}
              >
                <ShareIcon width={24} height={24} />
              </TouchableOpacity>
            ),
          }}
        >
          {!!shouldRenderOverviewTab ? (
            <Tabs.Tab name="Overview" label="Overview">
              <Tabs.Lazy>
                <CollectionOverview collection={data} />
              </Tabs.Lazy>
            </Tabs.Tab>
          ) : null}
          <Tabs.Tab name="Artworks" label="Artworks">
            <Tabs.Lazy>
              <CollectionArtworks collection={data} />
            </Tabs.Lazy>
          </Tabs.Tab>
        </Tabs.TabsWithHeader>
      </ArtworkFiltersStoreProvider>
    </ProvideScreenTracking>
  )
}

const CollectionQueryRenderer: React.FC<CollectionScreenProps> = ({ collectionID }) => {
  const data = useLazyLoadQuery<CollectionQuery>(query, { collectionID })

  if (!data?.collection) {
    return null
  }

  return <CollectionContent collection={data?.collection} />
}

export const CollectionScreen: React.FC<CollectionScreenProps> = ({ collectionID }) => {
  return (
    <Suspense fallback={<Spinner />}>
      <CollectionQueryRenderer collectionID={collectionID} />
    </Suspense>
  )
}

const query = graphql`
  query CollectionQuery($collectionID: String!) {
    collection: marketingCollection(slug: $collectionID) @principalField {
      ...Collection_collection
    }
  }
`

export const fragment = graphql`
  fragment Collection_collection on MarketingCollection {
    ...CollectionOverview_collection
    id
    slug
    title
    isDepartment
    showFeaturedArtists
    descriptionMarkdown
    ...CollectionHeader_collection
    ...CollectionArtworks_collection @arguments(input: { sort: "-decayed_merch" })
    ...CollectionArtworksFilter_collection
    ...FeaturedArtists_collection
    ...CollectionHubsRails_collection
    linkedCollections {
      ...CollectionHubsRails_linkedCollections
    }
  }
`
