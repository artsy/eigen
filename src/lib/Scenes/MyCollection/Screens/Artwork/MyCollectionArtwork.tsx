import { MyCollectionArtworkQuery } from "__generated__/MyCollectionArtworkQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { goBack, navigate, popToRoot } from "lib/navigation/navigate"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { PlaceholderBox, ProvidePlaceholderContext } from "lib/utils/placeholders"
import { Flex, Text } from "palette/elements"
import React, { Suspense, useCallback } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { MyCollectionArtworkHeader } from "./NewComponents/NewMyCollectionArtworkHeader"
import { OldMyCollectionArtworkQueryRenderer } from "./OldMyCollectionArtwork"

export enum Tab {
  insights = "Insights",
  about = "About",
}

const MyCollectionArtworkScreenQuery = graphql`
  query MyCollectionArtworkQuery($artworkSlug: String!) {
    artwork(id: $artworkSlug) {
      ...NewMyCollectionArtworkHeader_artwork
      internalID
      consignmentSubmission {
        inProgress
      }
    }
  }
`

const MyCollectionArtwork: React.FC<MyCollectionArtworkScreenProps> = ({ artworkSlug }) => {
  const data = useLazyLoadQuery<MyCollectionArtworkQuery>(MyCollectionArtworkScreenQuery, {
    artworkSlug,
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

  return (
    <Flex flex={1}>
      {
        <FancyModalHeader
          onLeftButtonPress={goBack}
          rightButtonText="Edit"
          displayRightButton={displayEditButton}
          onRightButtonPress={handleEdit}
        />
      }
      <StickyTabPage
        tabs={[
          {
            title: Tab.insights,
            content: (
              <Flex>
                <Text>Insights Tab</Text>
              </Flex>
            ),
            initial: true,
          },
          {
            title: Tab.about,
            content: (
              <Flex>
                <Text>About Tab</Text>
              </Flex>
            ),
          },
        ]}
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
