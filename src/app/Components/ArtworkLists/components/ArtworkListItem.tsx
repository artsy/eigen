import { Flex, Join, LockIcon, Spacer, Switch, Text } from "@artsy/palette-mobile"
import { ArtworkListItem_item$key } from "__generated__/ArtworkListItem_item.graphql"
import { ArtworkListImagePreview } from "app/Components/ArtworkLists/components/ArtworkListImagePreview"
import { ArtworkListItemSelectedIcon } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/ArtworkListItemSelectedIcon"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { FC, memo } from "react"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"

export interface PressedArtworkListItem {
  internalID: string
  name: string
  isSavedArtwork?: boolean
  shareableWithPartners?: boolean
}

interface ArtworkListItemProps {
  item: ArtworkListItem_item$key
  onPress: (item: PressedArtworkListItem) => void
  selected: boolean
  shareableWithPartners?: boolean
}

const Item: FC<ArtworkListItemProps> = (props) => {
  const artworkList = useFragment(ArtworkListItemFragment, props.item)
  const nodes = extractNodes(artworkList.artworksConnection)
  const isArtworkListOfferabilityEnabled = useFeatureFlag("AREnableArtworkListOfferability")
  const imageURL = nodes[0]?.image?.resized?.url ?? null

  const selectionList = artworkList.isSavedArtwork !== undefined
  const privacyList =
    artworkList.shareableWithPartners !== undefined &&
    !selectionList &&
    !!isArtworkListOfferabilityEnabled

  const getArtworksCountText = () => {
    if (artworkList.artworksCount === 1) {
      return `1 Artwork`
    }

    return `${artworkList.artworksCount} Artworks`
  }

  const handlePress = () => {
    let result: PressedArtworkListItem
    if (selectionList) {
      result = {
        internalID: artworkList.internalID,
        name: artworkList.name,
        isSavedArtwork: artworkList.isSavedArtwork,
      }
    } else {
      result = {
        internalID: artworkList.internalID,
        name: artworkList.name,
        shareableWithPartners: artworkList.shareableWithPartners,
      }
    }

    props.onPress(result)
  }

  return (
    <TouchableOpacity disabled={!!privacyList} onPress={handlePress}>
      <Flex py={1} px={2} flexDirection="row" alignItems="center">
        <Join separator={<Spacer x={1} />}>
          <ArtworkListImagePreview imageURL={imageURL} />

          <Flex flex={1}>
            <Flex flexDirection="row">
              <Flex flexShrink={1}>
                <Text variant="xs" numberOfLines={1}>
                  {artworkList.name}
                </Text>
              </Flex>

              {!artworkList.shareableWithPartners && !!isArtworkListOfferabilityEnabled && (
                <LockIcon ml={0.5} fill="black100" />
              )}
            </Flex>
            <Text variant="xs" color="black60">
              {getArtworksCountText()}
            </Text>
          </Flex>

          {!!selectionList && <ArtworkListItemSelectedIcon selected={props.selected} />}
          {!!privacyList && (
            <Switch value={props.shareableWithPartners} onValueChange={handlePress} />
          )}
        </Join>
      </Flex>
    </TouchableOpacity>
  )
}

export const ArtworkListItem = memo(Item)

const ArtworkListItemFragment = graphql`
  fragment ArtworkListItem_item on Collection
  @argumentDefinitions(
    artworkID: { type: "String!" }
    includeArtwork: { type: "Boolean", defaultValue: true }
  ) {
    name
    internalID
    isSavedArtwork(artworkID: $artworkID) @include(if: $includeArtwork)
    shareableWithPartners
    artworksCount(onlyVisible: true)
    artworksConnection(first: 4) {
      edges {
        node {
          image {
            resized(height: 300, width: 300, version: "normalized") {
              url
            }
          }
        }
      }
    }
  }
`
