import { OwnerType } from "@artsy/cohesion"
import { ArtworkScreenHeaderCreateAlert_artwork$data } from "__generated__/ArtworkScreenHeaderCreateAlert_artwork.graphql"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SavedSearchEntityArtist,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { compact, isEmpty } from "lodash"
import { useState } from "react"

export const useCreateArtworkAlert = (artwork: ArtworkScreenHeaderCreateAlert_artwork$data) => {
  const [isCreateAlertModalVisible, setIsCreateAlertModalVisible] = useState(false)
  const hasArtists = !isEmpty(artwork.artists) && artwork.artists!.length > 0

  if (!hasArtists) {
    return {
      entity: null,
      attributes: null,
      aggregations: null,
      showModal: () => null,
      closeModal: () => null,
      isCreateAlertModalVisible: false,
    }
  }

  let aggregations: Aggregations = []
  let additionalGeneIDs: string[] = []

  const artists = compact(artwork?.artists)
  const attributionClass = compact([artwork?.attributionClass?.internalID])
  const formattedArtists: SavedSearchEntityArtist[] = artists.map((artist) => ({
    id: artist.internalID,
    name: artist.name!,
  }))

  const entity: SavedSearchEntity = {
    placeholder: `Artworks like: ${artwork?.title!}`,
    artists: formattedArtists,
    owner: {
      type: OwnerType.artwork,
      id: artwork?.internalID ?? "",
      slug: artwork?.slug ?? "",
    },
  }

  if (artwork?.mediumType?.filterGene?.name && artwork?.mediumType?.filterGene.slug) {
    additionalGeneIDs = [artwork.mediumType.filterGene.slug]
    aggregations = [
      {
        slice: "MEDIUM",
        counts: [
          {
            name: artwork.mediumType.filterGene.name,
            value: artwork.mediumType.filterGene.slug,
            count: 0,
          },
        ],
      },
    ]
  }

  const attributes: SearchCriteriaAttributes = {
    artistIDs: formattedArtists.map((artist) => artist.id),
    attributionClass,
    additionalGeneIDs,
  }

  const handleCreateAlertPress = () => {
    setIsCreateAlertModalVisible(true)
  }

  const closeModal = () => {
    setIsCreateAlertModalVisible(false)
  }

  return {
    entity,
    attributes,
    aggregations,
    showModal: handleCreateAlertPress,
    closeModal,
    isCreateAlertModalVisible,
  }
}
