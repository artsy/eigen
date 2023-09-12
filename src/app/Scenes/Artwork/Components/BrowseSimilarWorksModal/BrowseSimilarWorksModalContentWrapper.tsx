import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { BrowseSimilarWorksModalContent } from "app/Scenes/Artwork/Components/BrowseSimilarWorksModal/BrowseSimilarWorksModalContent"
import { CreateSavedSearchAlertParams } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"

export interface BrowseSimilarWorksModalContentWrapperProps {
  visible: boolean
  entity: SavedSearchEntity
  attributes: SearchCriteriaAttributes
  aggregations: Aggregations
  closeModal: () => void
}

export const BrowseSimilarWorksModalContentWrapper: React.FC<
  BrowseSimilarWorksModalContentWrapperProps
> = (props) => {
  const { visible, entity, attributes, aggregations, closeModal } = props

  const params: CreateSavedSearchAlertParams = {
    aggregations,
    attributes,
    entity,
    onClosePress: () => {
      closeModal() // close the alert modal
    },
    onComplete: () => {},
  }

  if (!visible) return null

  return <BrowseSimilarWorksModalContent visible={visible} params={params} />
}
