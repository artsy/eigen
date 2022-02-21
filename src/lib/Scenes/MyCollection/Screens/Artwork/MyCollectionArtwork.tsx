import { MyCollectionArtworkQuery } from "__generated__/MyCollectionArtworkQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { goBack, navigate, popToRoot } from "lib/navigation/navigate"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { PlaceholderBox, ProvidePlaceholderContext } from "lib/utils/placeholders"
import { compact } from "lodash"
import { Flex, Text } from "palette/elements"
import React, { Suspense, useCallback } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { MyCollectionArtworkAbout } from "./MyCollectionArtworkAbout"
import { MyCollectionArtworkInsights } from "./MyCollectionArtworkInsights"
import { MyCollectionArtworkHeader } from "./NewComponents/NewMyCollectionArtworkHeader"
import { OldMyCollectionArtworkQueryRenderer } from "./OldMyCollectionArtwork"

export enum Tab {
  insights = "Insights",
  about = "About",
}

const MyCollectionArtworkScreenQuery = graphql`
  query MyCollectionArtworkQuery($artworkSlug: String!, $artistInternalID: ID!, $medium: String!) {
    artwork(id: $artworkSlug) {
      ...NewMyCollectionArtworkHeader_artwork
      internalID
      consignmentSubmission {
        inProgress
      }
      ...MyCollectionArtworkInsights_artwork
      ...MyCollectionArtworkAbout_artwork
    }
    marketPriceInsights(artistId: $artistInternalID, medium: $medium) {
      ...MyCollectionArtworkInsights_marketPriceInsights
    }
  }
`

const MyCollectionArtwork: React.FC<MyCollectionArtworkScreenProps> = ({
  artworkSlug,
  artistInternalID,
  medium,
}) => {
  const data = useLazyLoadQuery<MyCollectionArtworkQuery>(MyCollectionArtworkScreenQuery, {
    artworkSlug,
    artistInternalID,
    medium,
  })

  if (!data.artwork) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text>The requested Artwork is not available</Text>
      </Flex>
    )
  }

  const handleEdit = useCallback(() => {
    navigate(`my-collection/artworks/${data.artwork!.internalID}/edit`, {
      passProps: {
        mode: "edit",
        artwork: data.artwork,
        onSuccess: popToRoot,
        onDelete: popToRoot,
      },
    })
  }, [data.artwork])

  const displayEditButton = !data.artwork.consignmentSubmission?.inProgress

  // TODO: Hide insight tabs if not insights available
  const tabs = compact([
    {
      title: Tab.insights,
      content: (
        <MyCollectionArtworkInsights
          artwork={data.artwork}
          marketPriceInsights={data.marketPriceInsights!}
        />
      ),
      initial: true,
    },
    {
      title: Tab.about,
      content: <MyCollectionArtworkAbout artwork={data.artwork} />,
    },
  ])

  return (
    <Flex flex={1}>
      <FancyModalHeader
        onLeftButtonPress={goBack}
        rightButtonText="Edit"
        onRightButtonPress={displayEditButton ? handleEdit : undefined}
        hideBottomDivider
      />
      <StickyTabPage
        tabs={tabs}
        staticHeaderContent={<MyCollectionArtworkHeader artwork={data.artwork!} />}
      />
    </Flex>
  )
}

const MyCollectionArtworkPlaceholder = () => (
  <ProvidePlaceholderContext>
    <Flex flexDirection="column" justifyContent="space-between" height="100%" pb={8}>
      <PlaceholderBox width="100%" marginBottom={10} />
    </Flex>
  </ProvidePlaceholderContext>
)
export interface MyCollectionArtworkScreenProps {
  artworkSlug: string
  artistInternalID: string
  medium: string
}

export const MyCollectionArtworkQueryRenderer: React.FC<MyCollectionArtworkScreenProps> = (
  props
) => {
  const AREnableNewMyCollectionArtwork = useFeatureFlag("AREnableNewMyCollectionArtwork")

  if (AREnableNewMyCollectionArtwork) {
    return (
      <Suspense fallback={<MyCollectionArtworkPlaceholder />}>
        <MyCollectionArtwork {...props} />
      </Suspense>
    )
  }

  return <OldMyCollectionArtworkQueryRenderer {...props} />
}
